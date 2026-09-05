// Step 1: Import modules
const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");
// Step 2: Initialize Express App
const app = express();
const PORT = 3000;
// Step 3: Global Inbuilt Middleware
// express.json() to parse incoming JSON payloads
app.use(express.json());
// Step 4: Global Custom Logger Middleware
// Logs Method, URL, and Timestamp for each request
app.use(logger);
// Step 5: Root Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Student Management REST API",
    version: "1.0.0",
    endpoints: {
      getAllStudents: "GET /students",
      getStudentById: "GET /students/:id",
      createStudent: "POST /students",
      updateStudent: "PUT /students/:id",
      deleteStudent: "DELETE /students/:id"
    }
  });
});
// Step 6: Modular Routing
// Mount student routes under /students
app.use("/students", studentRoutes);
// Step 7: 404 Catch-All Middleware for Undefined Routes
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});
// Step 8: Central Error Handling Middleware (4 arguments)
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack || err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message || "Internal Server Error"
  });
});
// Step 9: Start Express Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
