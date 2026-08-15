const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.end('Welcome to the Home Page');
    } else if (req.url === '/read' && req.method === 'GET') {
        // const data = fs.readFileSync('1.json', 'utf-8');
        // res.end(data);

        // using streams to read the file
        const data= fs.createReadStream('1.json', 'utf-8');
        data.pipe(res);
    } else if (req.url === '/add') {
        res.end("Data added");
    }else{
        res.statusCode = 404;
        res.end("Page not found");
    }
});
server.listen(5500, () => {
    console.log('Server is running on port 5500');
});