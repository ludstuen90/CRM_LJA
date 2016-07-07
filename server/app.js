var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});
var app=express();
app.use( bodyParser.json() );

global.clientId=0;
global.caseId=0;
global.noteId=0;


//include Database

var pg = require('pg');
var connectionString= 'postgres://localhost:5432/LJACRM';

//Spin up local server
app.listen(3000, 'localhost', function(req, res){
  console.log("Server is listening on port 3000");
});


app.get('/', function(req, res){
  console.log("Home page hit received");
  console.log("our global variable is now ", global.clientId);
  res.sendFile(path.resolve('views/index.html'));
});

app.get('/getInsurer', function(req, res){
  console.log("Get insurer request received!");
  resultsIns= [];
  pg.connect(connectionString, function(err, client, done){
    var search = ('SELECT * FROM insurers WHERE client_id=' + global.clientId);
    var query1 = client.query(search);
    query1.on('row', function(row){
      resultsIns.push(row);
    });
    query1.on('end', function(){
      done();
      console.log(resultsIns);
      return res.json(resultsIns);
    });

  });

});

app.post('/sendClient', function(req, res){
  console.log(req.body.id);
  console.log('current client is now', req.body.id);
  global.clientId= req.body.id;
  res.sendStatus(200);
});

app.get('/360View', function(req, res){
  res.sendFile(path.resolve('views/index.html'));
});


app.post('/getInfo', function(req, res){
  console.log("Get client request received!");
  var client = {
    id: req.body.id
  };

  global.clientId = req.body.id;

  console.log("global.clientId is now ", global.clientId);

console.log("We are about to search for client ", client.id);
var search =('SELECT * FROM clients WHERE id=' + client.id );
search.toString();
  results = [];
  pg.connect(connectionString, function(err, client, done){
    var query = client.query(search );
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




app.get('/getClient', function(req, res){
  console.log("Get client request received!");
  results = [];
  pg.connect(connectionString, function(err, client, done){
    var searchClient = ('SELECT * FROM clients WHERE id=' + global.clientId);
    var query = client.query(searchClient);
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


app.get('/getCases', function(req, res){
  console.log("Get case request received!");
  resultsCase = [];
  pg.connect(connectionString, function(err, client, done){
    var searchCases = ('SELECT * FROM cases_meta WHERE client_id=' + global.clientId);
    console.log("we are sending over the query");
    console.log('SELECT * FROM cases_meta WHERE client_id=' + global.clientId);
    var query = client.query(searchCases);
    query.on('row', function(row){
      resultsCase.push(row);
    });
    query.on('end', function(){
      done();
      console.log(resultsCase);
      return res.json(resultsCase);
    });
    if(err){
      console.log(err);
    }
  });
});


app.get('/caseDet', function(req, res){
  console.log("Get case request received!");
  resultsCaseNot = [];
  pg.connect(connectionString, function(err, client, done){
    var searchCaseNotes = ('SELECT * FROM cases_notes WHERE case_id=' + global.caseId);
    console.log("we are sending over the query");
    console.log('SELECT * FROM cases_notes WHERE case_id=' + global.caseId);
    var query = client.query(searchCaseNotes);
    query.on('row', function(row){
      resultsCaseNot.push(row);
    });
    query.on('end', function(){
      done();
      console.log("And the results from case notes will be ...");
      console.log(resultsCaseNot);
      return res.json(resultsCaseNot);
    });
    if(err){
      console.log(err);
    }
  });
});



app.get('/caseMet', function(req, res){
  console.log("Get case request received!");
  resultsCaseMet = [];
  pg.connect(connectionString, function(err, client, done){
    var searchCaseMeta = ('SELECT * FROM cases_meta WHERE id=' + global.caseId);
    console.log("we are sending over the query");
    console.log('SELECT * FROM cases_meta WHERE id=' + global.caseId);
    var query = client.query(searchCaseMeta);
    query.on('row', function(row){
      resultsCaseMet.push(row);
    });
    query.on('end', function(){
      done();
      console.log('and the results for case meta informatio will be...');
      console.log(resultsCaseMet);
      return res.json(resultsCaseMet);
    });
    if(err){
      console.log(err);
    }
  });
});



app.get('/noteSee', function(req, res){
return res.json(global.noteId);

});


app.post('/noteView', function(req, res){
  console.log("Received a note view request of", req.body.view);
  global.noteId= req.body.view;
  console.log('note global variable is now ', global.noteId);
  res.sendStatus(200);
});


app.post('/caseParams', function(req, res){
  console.log("Request Received to go to a case");
  console.log(req.body.case_id);
  global.caseId= req.body.case_id;
  res.sendStatus(200);
});

app.get('/search', function(req, res){
  res.sendFile(path.resolve('views/search.html'));
});

app.get('/caseNoteView', function(req, res){
  res.sendFile(path.resolve('views/caseNoteView.html'));
});

app.get('/case', function(req, res){
  res.sendFile(path.resolve('views/case.html'));
});

//Assign Static Folder
app.use( express.static('public'));
