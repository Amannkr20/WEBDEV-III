// Step 1: Import http built-in module
const http = require("http");

// Step 2: Define port number
const PORT = 3000;

// Step 3: Create HTTP server with routes
const server = http.createServer((req, res) => {
  // Set content type header
  res.setHeader("Content-Type", "text/plain");

  // Handle routes using simple if-else
  if (req.url === "/") {
    res.statusCode = 200;
    res.end("Welcome to Node Server");
  } else if (req.url === "/about") {
    res.statusCode = 200;
    res.end("About Page");
  } else if (req.url === "/contact") {
    res.statusCode = 200;
    res.end("Contact Page");
  } else {
    res.statusCode = 404;
    res.end("404 Error Message");
  }
});

// Step 4: Handle port error if already running
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is busy. Stop existing server or change port.`);
  }
});

// Step 5: Start server on port 3000
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
