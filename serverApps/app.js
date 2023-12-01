const http = require('http');
//remember order : first serverIncomingmessage (request) argument, then serverResponse argument
//else error res.end() is not a function.
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    //w/o setheader browser wraps in some pre style text//
    //setHeader changes response content type.
    //res.end('<h1>Success!</h1>');
    res.end('<form><input type="text" name="nameHolder"><button type="submit">Create User</button></form>');

});

/*
//event driven architecture of node js that tells that if x event happens do y
// if a request happens execute this funciton - its called whenever a request reaches and send response.

//event loop will keeps on running as long as there are event listeners registered and you do not process.exit() - used for hard exit then it will end.

function rqListener(req, res) {

}
http.createServer(rqListener);
*/
/*
const server = http.createServer((req, res) => {
const url = req.url;
if (url = '/') {
res.write('<html>');
res.write('<head>---</head>/);
res.write('<body><form method = 'POST' action='/message"></form></body>');
res.write(</html>);
return res.end();
})
//else res.write something else;
if( url === '/message' && method === 'POST'){
    fs.writeFileSync('message.txt', 'DUMMY');
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
}

*/

/*
streams and chunks
Event driven model node executes passed in functions at a later point in time - this is the pattern when node js executes a function

if (url === '/method' and method = 'POST'){
const body = [];
req.on('data',(chunk) => {
    console.log(chunk);
    body.push(chunk);
});
req.on('end', () => {        //node js will add a new event listener to a sort of internal registry of events and listeners to be executed later point of time.
                                // when node js is done parsing the request it will then send end event and accordingly execute the related event listener.
                                //overall will not pause other code execution and will jump to next line.
 const parsedBody = Buffer.concat(body).toString();
 console.log(parsedBody);
 const message = parsedBody.split('=')[1];
 fs.writeFile('message.txt' , message, (err) => { error handling code });
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
 });
}
 res.setHeader('Content-type', 'text/html');
 res.write('<html>');
 res.write('<head><title> My first page </title></head>');
 res.write('<body><h1> Hello from my Node.js Server </h1></body>');
 res.write('</html>');
 res.end();
}
*/

server.listen(5000);
