//  Http- hypertext transfer protocol
// it builds connection between client and server


const http = require("http");
const server= http.createServer((request,response)=>{
    response.end("Hello World");
});
server.listen(8080);

