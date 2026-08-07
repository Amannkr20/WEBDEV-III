const http = require("http");
const server= http.createServer((req,res)=>{
if (req.url=="/"){
    res.end("Welcome to Home Page");
}else if (req.url=="/about"){
    res.end("Welcome to About Page");
}else if (req.url=="/contact"){
    res.end("Welcome to Contact Page");
}else if (req.url=="/services"){
    res.end("Welcome to Services Page");
}
else if (req.url=="/products"){
    res.end("Welcome to Products Page");
}else{
    res.end("404 Page Not Found");
}
});
server.listen(8080,()=>{
    console.log("Server is running on port 8080");
}); 

