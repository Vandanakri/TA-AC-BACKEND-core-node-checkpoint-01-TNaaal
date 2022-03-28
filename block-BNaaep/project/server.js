const http = require('http');
const fs = require('fs');
const url = require('url');

const usersPath = __dirname + '/users/';

const server = http.createServer(handleRequest);

function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);

    let store = '';
    req.on('data', (chunk) => {
        store += chunk;
    });

    req.on('end', () => {
        if (req.method === 'POST' && req.url === '/users') {
            const username = JSON.parse(store).username;
            fs.open(usersPath + username + '.json', 'wx', (err, fd) => {
                if(err) return console.log(err);
                fs.writeFile(fd, store, (err) => {
                    if (err) return console.log(err);
                    fs.close(fd, () => {
                       return res.end(`${username} created successfully`);
                    })
                })
                
            })
        }

        if (parsedUrl.pathname === '/users' && req.method === 'GET') {
            const username = parsedUrl.query.username;
            fs.readFile(usersPath + username + '.json', (err, content) => {
                if (err) return console.log(err);
                res.setHeader('Content-Type', 'application/json');
                return res.end(content);
            })
        }

        if (parsedUrl.pathname === '/users' && req.method === 'PUT') {
            const username = parsedUrl.query.username;
            fs.open(usersPath + username + '.json', 'r+', (err, fd) => {
                if (err) return console.log(err);
                fs.ftruncate(fd, (err) => {
                    if (err) return console.log(err);
                    fs.writeFile(fd, store, (err) => {
                        if (err) return console.log(err);
                        fs.close(fd, () => {
                           return res.end(`${username} updated successfully`);
                        })
                    })
                })
                
            })
        }

        if(parsedUrl.pathname === '/users' && req.method === 'DELETE') {
            const username = parsedUrl.query.username;
            fs.unlink(usersPath + username + '.json', (err) => {
                if(err) return console.log(err);
                return res.end(`${username} is deleted.`)
            })
        }

        res.statusCode = 404;
        res.end('Page not found');

    })
}
server.listen(3000, () => {
    console.log('Server listening on port 3k');
})