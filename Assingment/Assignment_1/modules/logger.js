// Custom logger module with timestamps and simple logs

function logInfo(msg) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] [INFO]: ${msg}`);
}

function logSuccess(msg) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] [SUCCESS]: ${msg}`);
}

function logError(msg) {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] [ERROR]: ${msg}`);
}

// Export logger functions
module.exports = {
  logInfo,
  logSuccess,
  logError
};
