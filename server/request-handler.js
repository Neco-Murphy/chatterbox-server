/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */

// var exports = module.exports = {};
var fs = require('fs');
var urlParse = require('url');

var data;

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10,
  "Content-Type": "application/json"
};

fs.readFile('./message.log', function (err, messages) {
  if (err) {
    data = {results: []};
  } else {
    console.log(messages.toString('utf8').split('---'));
    data = {results: messages.toString('utf8').split('---')};
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

  var respondRequest = function(statusCode, output){
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(output));
  };


  /* .writeHead() tells our server what HTTP status code to send back */
  //response.writeHead(statusCode, headers);

  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/


  var addData = function(request){
    request.on('data', function(chunk){
      data.results.push(JSON.parse(chunk));
      fs.exists("./message.log", function(exists){
        if(exists){
          fs.appendFile('message.log', "---" + JSON.stringify(data.results[data.results.length-1]), function (err) {
            if (err) {
              throw err;
            }
          });
        } else {
          fs.appendFile('message.log', JSON.stringify(data.results[data.results.length-1]), function (err) {
            if (err) {
              throw err;
            }
          });
        }
      });
    });
  };

  var actions = {
    'GET': function(request, response){
      if(request.url === "/classes/messages/" || request.url.search("/classes/room") !== -1){
        respondRequest(200, data);
      }
    },
    'POST': function(request, response){
    //   request.on('data', function (chunk) {
    //   data.results.push(JSON.parse(chunk));
    // });
      addData(request);
      respondRequest(201, null)
    },
    'OPTIONS': function(request, response){
      headers['Allow'] = 'HEAD,GET,PUT,DELETE,OPTIONS';
      respondRequest('200 OK', data);
    }
  }

  var action = actions[request.method];
  if(action){
    action(request, response);
  }else{
    respondRequest(404, null);
  }

};

