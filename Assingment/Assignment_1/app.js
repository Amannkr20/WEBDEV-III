// Step 1: Import custom modules using require()
const isEven = require("./modules/isEven");
const logger = require("./modules/logger");

logger.logInfo("Testing custom modules in app.js...");

// Step 2: Test isEven module with sample numbers
const numbers = [4, 7, 10, 15, 20];

numbers.forEach((num) => {
  if (isEven(num)) {
    logger.logSuccess(`Number ${num} is EVEN`);
  } else {
    logger.logInfo(`Number ${num} is ODD`);
  }
});

logger.logSuccess("Custom module test completed!");
