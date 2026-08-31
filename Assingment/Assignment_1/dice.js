// Random Dice Generator using crypto module

const crypto = require("crypto");
const fs = require("fs");

// Step 1: Read roll count from command line (defaults to 1)
const args = process.argv.slice(2);
const rolls = Number(args[0]) || 1;

console.log(`\nSimulating ${rolls} Dice Roll(s):\n`);

let historyLog = "";

// Step 2: Loop to simulate dice rolls
for (let i = 1; i <= rolls; i++) {
  // Generate random number from 1 to 6
  const diceValue = crypto.randomInt(1, 7);
  console.log(`Dice Rolled: ${diceValue}`);

  historyLog += `Roll ${i}: ${diceValue}\n`;
}

// Step 3: Save roll history to text file
fs.appendFile("dice_history.txt", historyLog, (err) => {
  if (err) {
    console.log("Error saving roll history:", err);
  } else {
    console.log("Dice roll history saved to dice_history.txt");
  }
});
