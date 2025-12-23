const http = require('http');
const fs = require('fs');
const path = require('path');
const queryString = require('querystring');

// SET YOUR PASSWORD HERE
const MY_PASSWORD = "123"; 

const server = http.createServer((req, res) => {
    // 1. ROUTE FOR THE PUBLIC VIEW
    if (req.url === '/' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, '../index.html'), (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    } 
    // 2. ROUTE FOR THE ADMIN PAGE
    else if (req.url === '/admin' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, '../admin.html'), (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    }
    // 3. ROUTE TO SAVE NEWS (THE PUBLISH ACTION)
    else if (req.url === '/api/publish' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const data = queryString.parse(body);
            
            // CHECK PASSWORD
            if (data.password !== MY_PASSWORD) {
                res.writeHead(403);
                return res.end("WRONG PASSWORD!");
            }

            // FOR NOW: This will work locally, but on Vercel 
            // we will need to connect the KV database next.
            console.log("News Received:", data.title);
            res.writeHead(302, {'Location': '/'});
            res.end();
        });
    }
});

module.exports = server;
