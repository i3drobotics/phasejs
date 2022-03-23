var express = require('express');
var http = require('http');
var path = require("path");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

const internal = require("./export.js");

// setup server
var app = express();

// rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// setup app
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(internal.root));
app.use(helmet());
app.use(limiter);

// get html
app.get('/', function(req,res){
  res.sendFile(internal.index_page);
});

internal.config_app(app);

// listen for server on port 3000
var ip = '0.0.0.0';
if (process.platform === "win32") {
  ip = '127.0.0.1';
}
var server = app.listen(3000, ip, function(){ 
  var host = server.address().address;
  var port = server.address().port;
  console.log('running at http://' + host + ':' + port)
});
