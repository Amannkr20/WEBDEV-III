const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.get("/read", (req, res) => {
    const data = {JSON.parse(fs.readFileSync("./1.json", "utf-8"))};
    res.send(data);
});

app.get("/readtr", (req, res) => {
    const data = {JSON.parse(fs.readFileSync("./1.json", "utf-8"))};
    res.send(data);
});





app.listen(8080, () => {
    console.log("Server Started");
    })
