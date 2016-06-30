var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var app=express();

//Spin up local server




app.listen(3000, 'localhost', function(req, res){
  console.log("Server is listening on port 3000");
});


app.get('/', function(req, res){
  console.log("Home page hit received");
  res.sendFile(path.resolve('views/index.html'));
});

//Assign Static Folder
app.use( express.static('public'));
