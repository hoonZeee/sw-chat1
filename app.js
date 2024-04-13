var http = require("http");
var fs = require("fs");
var url = require("url");
var WebSocket = require("ws");

var app = http.createServer((req, res) => {
  var _url = req.url;
  var path = url.parse(_url, true).pathname;

  if (path === "/") {
    fs.readFile(`./index.html`, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end("Server Error");
        return;
      }
      res.writeHead(200, { "Content-type": "text/html" });
      res.end(data);
    });
  } else {
    fs.readFile(`.${path}`, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not Found");
        return;
      }
      res.writeHead(200);
      res.end(data);
    });
  }
});

const wss = new WebSocket.Server({ server: app });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("Received: %s", message);
    ws.send(message);
  });

  console.log("Client connected");
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000/`);
});
