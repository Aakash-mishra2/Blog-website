const express = require('express');
const app = express();
//project has start script to nodemon app.js setted up.
//allows us to register a middleware on all incoming request  .
app.use((req, res, next) => {
    let body = '';
    req.on('end', () => {
        const userName = body.split('=')[1];
        if (userName) {
            console.log(userName);
            req.body = { name: userName };
        }
        //forward the request to next middleware in line.
        next();
    })
    req.on('data', chunk => {
        body += chunk;
    });
});

/*
syntax errors : typos, while coding etc.
Runtime errors: miss return on end, write method, not typos or brackets
Logical errors: App not working the way it should, use debugger for it. debugger always starts debugging from app.js
*/

app.use((req, res, next) => {
    if (req.body) {
        return res.send("<h1>" + req.body.name + "</h1>");
    }
    res.send(
        '<form method="POST"><input type="text" name="nameHolder"><button>Submit</button></form>'
    );
});

app.listen(5000);
