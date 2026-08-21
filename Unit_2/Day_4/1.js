// step-1
const { log } = require("console");
const express = require("express");
const fs = require ("fs");
// step-2
const app = express()
// middleware --> req.body --> parse
app.use(express.json());

// step-3 Routes/Api
app.get("/",(req,res) => {
    res.send({ msg: "welcome to exprrss server"})
});

app.get("/home",(req,res) => {
    res.send({ msg: "welcome to home page"})
});

app.get("/read",(req,res) => {
    const data = fs.readFileSync("./1.json","utf-8");
    // console.log(data, typeod data);

    // converting json data --- parse ---> js object
    const jsData = JSON.parse(data);
    console.log(jsData, typeof jsdata);

    console.log(jsData)
    
        res.send({ data: jsData})
});
app.post("/create",(req,res) =>{
    const payload = req.body;
    console.log(payload);
    const data = JSON.parse(fs.readFileSync("./1.json", "utf-8"));

    const stdata = data.student;
    console.log(stdata);
    stdata.push(payload);
    console.log(stdata);

    fs.writeFileSync ("./1.json", JSON.stringify(data));
    res.send({msg:"new student added successfully"});

    res.send({msg: "New student created successfully"});

});

app.put("/update/:id", (req,res) => {
    const payload = req.body;

    const id = req.params;
    console.log(id);

    const data = JSON.parse(fs.readFileSync("./1.json", "utf-8"));

    const stdata = data.student;
    console.log(stdata);

    const updatedData = stdata.map((el) => {
        if (el.id == req.params.id){
            return payload;
        } else return el;
 });
 console.log(updatedData);
 data.student = updatedData;
 fs.writeFileSync("./1.json", JSON.stringify(data));

 res.send({ msg: "student record updated"});
})



app.listen(8080, () => {
    console.log("Server started")
});


// post ---> add, create krna 

// client 3 tarike se client server se baat chit krta hai  (req bhejta hai) 
// 1. query parameter (most popular ) [www.google.com/?color=black& size=32]
// body parameter (req.body)
// req.params (/:id)[react router dom mein padha tha dynamic routing mein ]