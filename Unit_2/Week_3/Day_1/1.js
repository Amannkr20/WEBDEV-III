const express = require("express");

const app = express();
// Create a middlewere
const timeLoggerMiddleware= (req, res, next) => {
  const
  console.log(1);
  next();
  console.log(2);
};


const middlewere2 = (req, res, next) => {
  console.log(3);
  next();
  console.log(4);
};
// use a middlewere
app.use(middlewere2);
app.use(middlewere1);

// Home Page
app.get("/home", (req, res) => {
  console.log("Home Page");
  res.send({ msg: "home Page" });
});

// About Page
app.get("/about", (req, res) => {
  console.log("About Page");
  res.send({ msg: "About Page" });
});

app.listen(8080, () => {
  console.log("server started");
});
