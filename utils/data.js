const usernames = [
  'whatever',
  'anothername',
  'user14',
  'korvo',
  'terry',
];

const emails = [
  'myemail@email.com',
  'live@gmail.com',
  'rando@email.com',
  'live@email.com',
  'mymail@email.com',
];

// Get a random item given an array
const getRandomArrItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Gets a random full name
const getRandomUsername = () =>
  `${getRandomArrItem(username)} ${getRandomArrItem(username)}`;

// Function to generate random Email that we can add to student object.
const getRandomEmail = (int) => {
  const results = [];
  for (let i = 0; i < int; i++) {
    results.push({
      assignmentName: getRandomArrItem(emails),
      score: Math.floor(Math.random() * (99 - 70 + 1) + 70),
    });
  }
  return results;
};

// Export the functions for use in seed.js
module.exports = { getRandomUsernaame, getRandomEmail };
