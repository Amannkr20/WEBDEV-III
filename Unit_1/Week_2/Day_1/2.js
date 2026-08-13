// const http = require('http');
// const server = http.createServer((req, res) => {
// if (req.url == "/") {
//     res.end("Home Page");
// } else if (req.url == "/about") {
//     res.end("About Page");
// } else if (req.url == "/data") {
//     res.end("Data Page");
//     } else {
//     res.end("Error Page")
// } 
// });
// server.listen(5000, () => {
//     console.log("Server is listening on port 5000");
// }
// );


// const http = require('http');

// const server = http.createServer((req, res) => {
//     if (req.url === "/") {
//         res.end("Home Page");
//     } 
//     else if (req.url === "/about") {
//         res.end("About Page");
//     } 
//     else if (req.url === "/data") {
//     const data = fs.readFileSync("1.json", "utf-8");
//     res.end(data);
//     } 
//     else {
//         res.end("Error Page");
//     }
// });

// server.listen(5500  , () => {
//     console.log("Server is listening on port 5500");
// });


const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
    if (req.url === "/") {
        res.end("Home Page");
    } 
    else if (req.url === "/about") {
        res.end("About Page");
    } 
    else if (req.url === "/data") {
        const data = fs.readFileSync("1.json", "utf-8");
        res.end(data);
    } 
    else {
        res.end("Error Page");
    }
});

server.listen(5500, () => {
    console.log("Server is listening on port 5500");
});