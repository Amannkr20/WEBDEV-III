// node js is a javascript runtime environment 
const { log } = require('console');
const fs = require('fs'); // fs is a built-in module in node js that allows us to work with the file system
// 1. Read OPs
// fs.readFile("/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/1.txt", "utf8", (err,data)=>{
//     if(err){
//         log(err);
//     }else{
//         log(data);
    
// }
// });

// const ans=fs.readFileSync("/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/1.txt", "utf8");
// log(ans);

// 2. Write ops
// fs.writeFile("/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/1.txt", "Hello World", (err)=>{
//     if(err){
//         console.log(err);
//     }else{
//         console.log("File written successfully");
//     }
// }); 

// fs.writeFileSync("/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/1.txt", "Hello World 2");
// log("File written successfully 2");

// fs.appendFile("/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/1.txt", "\n Hello World 3", (err)=>{
//     if(err){
//         log(err);
//     }else{
//         log("File appended successfully");
//     }       
// }
// );

//  File Rename
// fs.rename("/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/1.txt", "/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/2.txt", (err)=>{
//     if(err){
//         log(err);
//     }else{
//         log("File renamed successfully");
//     }   
// }
// );

// File Delete
// fs.unlink("/Users/bhavya/Desktop/ /Sem_3/Web_Dev_3/WEB_DEV_3/Unit_1/Week_1/Day_3/1.txt", (err)=>{
//     if(err){
//         log(err);
//     }else{
//         log("File deleted successfully");
//     }   
// }
// );

