// Custom module to check if a number is even

function isEven(num) {
  // Return true if number is divisible by 2, else false
  return num % 2 === 0;
}

// Export the function so it can be used in other files
module.exports = isEven;
