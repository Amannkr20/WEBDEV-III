const express = require('express');
const fs = require("fs")


const studentRoutwer = express.Router();

studentRouter.get("/read", (req, res) => {
    const data = {JSON.parse(fs.readFileSync("./1.json", "utf-8"))};
    res.send(data.student;
});


module.exports = studentRouter;