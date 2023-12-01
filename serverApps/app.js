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

server.listen(5000);
