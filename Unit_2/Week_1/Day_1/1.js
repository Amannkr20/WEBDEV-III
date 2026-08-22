// Step 1- import express
const express = require("express");
// Step 2-  create a app through express.js
const app = express();
// Step 4- create api
app.get("/", (req, res) => {
  res.send("Home Page");
});
app.get("/about", (req, res) => {
  res.send("About Page");
});
// Step 3- listen/run app on port address
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});


