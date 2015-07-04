var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var fs = require("fs");

var router = express.Router();

var readJsonFileSync = function(filepath, encoding) {
    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

app.get('/', function(req, res){
  res.sendFile(__dirname + '/htdocs/index.html');
});

app.get('/api/:name', function(req, res){
	var baseFileName = req.params.name;
	var filePath = path.join(__dirname, '/data', baseFileName+'.json');

	res.json(readJsonFileSync(filePath));
});

app.use(express.static(path.join(__dirname, '/htdocs')));

var portNumber = 8080;
http.listen(portNumber, function(){
  console.log('listening on *:' + portNumber);
});