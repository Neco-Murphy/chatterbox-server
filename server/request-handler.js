/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

// var exports = module.exports = {};
var fs = require('fs');
var data;

fs.readFile('./message.log', function (err, messages) {
  if (err) {
    data = {results: []};
  } else {
    console.log(messages.toString('utf8').split('---'));
  }
});


exports.handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";
  /* .writeHead() tells our server what HTTP status code to send back */
  //response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/



  if(request.method === "POST"){
    request.on('data', function (chunk) {
      data.results.push(JSON.parse(chunk));
      fs.exists("./message.log", function(exists){
        if(exists){
          //console.log("The file does exist.")
          fs.appendFile('message.log', "---" + JSON.stringify(data.results[data.results.length-1]), function (err) {
            if (err) {
              throw err;
            } else {
              //console.log('The "data to append" was appended to file!');
            }
          });
        } else {
          //console.log("The file does NOT yet exist.")
          fs.appendFile('message.log', JSON.stringify(data.results[data.results.length-1]), function (err) {
            if (err) {
              throw err;
            } else {
              //console.log('The "data to append" was appended to file!');
            }
          });
        }
      });
    });

    statusCode = 201;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  }
  else if(request.method === "GET" && request.url === "/classes/messages/"){
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  } else if(request.method === 'OPTIONS'){
    statusCode = '200 OK';
    headers['Allow'] = 'HEAD,GET,PUT,DELETE,OPTIONS';
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  }else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }
};

exports.handler = function(request, response){
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */
  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = 200;

  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  headers['Content-Type'] = "text/plain";
  /* .writeHead() tells our server what HTTP status code to send back */
  //response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/



  if(request.method === "POST"){
    request.on('data', function (chunk) {
      data.results.push(JSON.parse(chunk));
    });
    statusCode = 201;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data));
  } else if (request.method === "GET" && request.url.search("/classes/room") !== -1) {
    statusCode = 200;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(data))
  } else {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end();
  }
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};
