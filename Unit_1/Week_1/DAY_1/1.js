// console.log("Hello World");
// const { log } = require("console");

// Node js core modules 

// 1. os- operating System 
// const os = require("os");
// console.log(os.freemem());
// console.log(os.platform());
// console.log(os.version());
// console.log(os.homedir());
// console.log(os.cpus());

// 2. dns
// const dns = require("dns");
// console.log(dns.getServers());

// 3. path- address
// const path = require("path");
// console.log(path.resolve());

// 4. crypto 
// const { log } = require("console");
const crypto = require("crypto");

// Hashing-
var name = "Bhavya Anand";
const hashedValue = crypto.createHash("sha256");
hashedValue.update(name);
const finalHash = hashedValue.digest("hex");

console.log("Hashed output:", finalHash);