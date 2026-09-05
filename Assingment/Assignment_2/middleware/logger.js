
// Custom Logger Middleware
// Logs HTTP Method, Request URL, and Timestamp for every incoming request.
const logger = (req, res, next) => {
  const time = new Date().toLocaleTimeString();
  console.log(`[${time}] ${req.method} ${req.originalUrl || req.url}`);
  next(); // Pass control to the next middleware or route handler
};
module.exports = logger;
