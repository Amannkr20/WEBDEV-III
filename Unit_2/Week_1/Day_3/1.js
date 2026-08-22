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
// middleware- request body parser
app.use(express.json());
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
app.get("/Read", (req, res) => {
  const data = fs.readFileSync("1.json", "utf-8");
  console.log(data);
  console.log(data.students);

  const jsData = JSON.parse(data);
  console.log(jsData);
  res.send({ msg: "Read Page" });
});
// app.get("/stread", (req, res) => {
//   const data = fs.readFileSync("1.json", "utf-8");
//   console.log(data);
//   console.log(data.students);

//   const jsData = JSON.parse(data);
//   console.log(jsData.students);
//   res.send({ msg: "Services Page" });
// });

// Adding new data-
app.post("/create", (req, res) => {
  const payload = req.body;
  console.log(payload);
  const data = JSON.parse(fs.readFileSync("1.json", "utf-8"));
  const stdata = data.students;
  stdata.push(payload);
  console.log(stdata);
  data.students = stdata;

  fs.writeFileSync("1.json", JSON.stringify(data));

  res.send({ msg: "New Student created" });
});
// S-4- Run app
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});