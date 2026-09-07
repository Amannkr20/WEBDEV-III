//Types of Middlewere 
// 3types

//  1.Core/inbuilt middlewere
//    ex express.json(), express router()

//  2.Internal/costom middlewere
//    ex time logger, request logger, watchman

//  3.External/Third party middlewere
//    ex multer , CORS



const express = require("express");
const fs = require("fs");

const app = express();


// 1.Timelogger M/w

const timeLoggerMiddlewere = (req,res,next)=>{
    const startTime = Date.now();
    next();
    const endTime = Date.now();
    console.log(`Time taken by route is : ${endTime-startTime}ms ⁠`);
};

// app.use(timeLoggerMiddlewere);

// 2.RouteLogger M/w

const routeLoggerMiddlewere = (req,res,next)=>{
    const record = `Route Name is : ${req.url} and method is : ${req.method}\n`;

    fs.appendFileSync("./1.txt", record);
    next();
};

app.use(routeLoggerMiddlewere);

// 3.Watchman M/w

const watchmanMiddlewere = (req,res,next)=>{
    if(req.url === "/home"){
        res.send("You are not allowed to access this route");
    }else{
        next();
    }
};

app.use(watchmanMiddlewere);    




app.get("/home", (req,res) => {
    res.send(" Home Page");
});

app.get("/about", (req,res) => {
    res.send(" About Page");
});

app.get("/read", (req,res) => {
    const data = fs.readFileSync("./1.json", "utf-8");
    res.send(data);
});

app.listen(8080, () => {
  console.log("server started");
});