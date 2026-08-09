// const crypto = require("crypto");  // common js method of importing and exporting 
//   //step 1 hash algo
//   const algo = crypto.createHash("shake256");
//   const data = algo.update("Bhavya Anand");
//   const ans = data.digest("hex")
// console.log(ans);
// console.log(ans.length);
// console.log()


//  File System module FS
const fs= require("fs");
fs.readFile("/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_2/1.txt","utf-8",(err,data)=>{
    if(err){
        console.log("Wrong path");
    }
    else{
        console.log(data);
    }
})
