// CLI Calculator using process.argv

// Step 1: Read command-line arguments
const args = process.argv.slice(2);
const operation = args[0];
const num1 = Number(args[1]);
const num2 = Number(args[2]);

// Step 2: Check if required arguments are provided
if (!operation || isNaN(num1) || isNaN(num2)) {
  console.log("Usage: node calculator.js <operation> <num1> <num2>");
  console.log("Example: node calculator.js add 10 5");
  process.exit(1);
}

// Step 3: Perform operation using switch-case
// 'switch' checks the 'operation' variable against different 'case' conditions
let result;

switch (operation) {
  // Stacking 'case' labels allows aliases (e.g. 'add' or '+') to run the same code block
  case "add":
  case "+":
    result = num1 + num2;
    break; // 'break' exits the switch block once a matching case completes

  case "sub":
  case "subtract":
  case "-":
    result = num1 - num2;
    break;

  case "multiply":
  case "mul":
  case "*":
    result = num1 * num2;
    break;

  case "divide":
  case "div":
  case "/":
    if (num2 === 0) {
      console.log("Error: Division by zero is not allowed.");
      process.exit(1);
    }
    result = num1 / num2;
    break;

  // 'default' acts like an 'else' block if none of the cases match
  default:
    console.log("Invalid operation! Use add, sub, multiply, or divide.");
    process.exit(1);
}

// Step 4: Display output
console.log("Result:", result);
