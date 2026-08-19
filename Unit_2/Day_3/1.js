// Express js is fast
// unoptinited code
// minimalist code
// nodejs setup- npm init -y, npm i express,npm i nodemon
// npm run server

// S-1- Import
const express = require("express");
const fs = require("fs");
// S-2- Create app
const app = express();
// S-3- Create api/routes
app.get("/", (req, res) => {
  res.send({ msg: "Wlcome to my Website " });
});
app.get("/about", (req, res) => {
  res.send({ msg: "About Page" });
});
app.get("/contact", (req, res) => {
  res.send({ msg: "Contact Page" });
});

// get API/Read Route
app.get("/services", (req, res) => {
  const data = fs.readFileSync("1.json", "utf-8");
  console.log(data);
  console.log(data.students);

  const jsData = JSON.parse(data);
  console.log(jsData);
  res.send({ msg: "Services Page" });
});
// S-4- Run app
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});