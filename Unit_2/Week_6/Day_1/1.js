const express = require('express');
const fs = require("fs")

const {studentRouter} = require

const app = express();

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get("/read", (req, res) => {
    const data = {JSON.parse(fs.readFileSync("./1.json", "utf-8"))};
    res.send(data.student;
});

app.get("/readtr", (req, res) => {
    const data = {JSON.parse(fs.readFileSync("./1.json", "utf-8"))};
    res.send(data.trainer);
});





app.listen(8080, () => {
    console.log("Server Started");
    })
