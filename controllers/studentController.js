const { ObjectId } = require('mongoose').Types;
const { Thought, User } = require('../models');

// Aggregate function to get the number of thoughts overall
const headCount = async () =>
  thought.aggregate()
    .count('thoughtCount')
    .then((numberOfThoughts) => numberOfThoughts);

// Aggregate function for getting the overall grade using $avg
const grade = async (thoughtId) =>
  thought.aggregate([
    // only include the given thought by using $match
    { $match: { _id: ObjectId(thoughtId) } },
    {
      $unwind: '$assignments',
    },
    {
      $group: {
        _id: ObjectId(thoughtId),
        overallGrade: { $avg: '$assignments.score' },
      },
    },
  ]);

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thought.find()
      .then(async (thoughts) => {
        const thoughtObj = {
          thoughts,
          headCount: await headCount(),
        };
        return res.json(thoughtObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single thought
  getSinglethought(req, res) {
    thought.findOne({ _id: req.params.thoughtId })
      .select('-__v')
      .then(async (thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json({
              thought,
              grade: await grade(req.params.thoughtId),
            })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new thought
  createthought(req, res) {
    thought.create(req.body)
      .then((thought) => res.json(thought))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a thought
  deletethought(req, res) {
    thought.findOneAndRemove({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No such thought exists' })
          : user.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true }
            )
      )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: 'thought deleted, but no users found',
            })
          : res.json({ message: 'thought successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an assignment to a thought
  addAssignment(req, res) {
    console.log('You are adding an assignment');
    console.log(req.body);
    thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { assignments: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Remove assignment from a thought
  removeAssignment(req, res) {
    thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res
              .status(404)
              .json({ message: 'No thought found with that ID :(' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
