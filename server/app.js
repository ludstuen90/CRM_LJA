var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});
var app=express();

//include Database

var pg = require('pg');
var connectionString= 'postgres://localhost:5432/LJACRM';

//Spin up local server
app.listen(3000, 'localhost', function(req, res){
  console.log("Server is listening on port 3000");
});


app.get('/', function(req, res){
  console.log("Home page hit received");
  res.sendFile(path.resolve('views/index.html'));
});

app.get('/getInsurer', function(req, res){
  console.log("Get insurer request received!");
  resultsIns= [];
  pg.connect(connectionString, function(err, client, done){
    var query1 = client.query('SELECT * FROM insurers WHERE id=1');
    query1.on('row', function(row){
      resultsIns.push(row);
    });
    query1.on('end', function(){
      done();
      return res.json(resultsIns);
    });

  });

});

app.get('/getClient', function(req, res){
  console.log("Get client request received!");
  results = [];
  pg.connect(connectionString, function(err, client, done){
    var query = client.query('SELECT * FROM clients WHERE id=1');
    query.on('row', function(row){
      results.push(row);
    });
    query.on('end', function(){
      done();
      return res.json(results);
    });
    if(err){
      console.log(err);
    }
    });

});

//Assign Static Folder
app.use( express.static('public'));
