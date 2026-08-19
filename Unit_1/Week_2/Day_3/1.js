const http = require('http');
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.end('Hello, World!');
    } else if (req.url === '/read' && req.method === 'POST') {
        // const data = req.body;  
        // console.log('Received data:', data);
        let str="";
        req.on('data', (chunk) => {
            str += chunk;
        });
        req.on('end', () => {
            console.log(str);
            res.end('Data is coming!\n data gone');
        });
    } else {
        res.statusCode = 404;
        res.end('Page not found');

    }
});
server.listen(5500, () => {
 console.log('Server is running on port 5500');
});
