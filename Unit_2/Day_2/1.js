// Express js is fast
// unoptinited code
// minimalist code
// nodejs setup- npm init -y, npm i express,npm i nodemon,

// S-1- Import
const express = require("express");
// S-2- Create app
const app = express();
// S-3- Create api/routes
app.get("/", (req, res) => {
  res.send({ msg: "Wlcome to my Website " });
});
app.get("/about", (req, res) => {
  res.send({ msg: "About Page" });
});
// S-4- Run app
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
