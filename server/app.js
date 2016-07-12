var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:true});
var app=express();
app.use( bodyParser.json() );

global.clientId=0;
global.caseId=0;
global.noteId=0;
global.insureId=0;


//include Database

var pg = require('pg');
var connectionString= 'postgres://localhost:5432/LJACRM';

//Spin up local server
app.listen(3000, 'localhost', function(req, res){
  console.log("Server is listening on port 3000");
});


// ################################# BELOW ADDED FOR LOG IN


var passport = require('../strategies/user_sql.js');
var session = require('express-session');

// Route includes
var index = require('../routes/index');
var user = require('../routes/user');
var register = require('../routes/register');


app.use(session({
   secret: 'secret',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: {maxage: 60000, secure: false}
}));

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/register', register);
app.use('/user', user);
app.use('/*', index);

// ################################# ABOVE ADDED FOR LOGIN
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
    var searchCases = ("SELECT * FROM cases_meta WHERE client_id=" + global.clientId +" AND status='open'");
    console.log("we are sending over the query");
    console.log("SELECT * FROM cases_meta WHERE client_id=" + global.clientId +" AND status='open'");
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


app.post('/newCase', function(req, res){
  console.log('received a case create request');
  console.log('author is ', req.body.author);
  console.log('assigned to ', req.body.assigned);
  console.log('claim number ', req.body.claimNo);
  console.log('summary', req.body.resumen);

  pg.connect(connectionString, function(err, client, done){
    client.query ('INSERT INTO cases_meta (created_by, assigned_to, claim_no, summary, client_id, open, title) VALUES ($1, $2, $3, $4, $5, $6, $7)', [req.body.author, req.body.assigned, req.body.claimNo, req.body.resumen, global.clientId, 'true', req.body.title ]);
    done();
  });
  res.sendStatus(200);
});



app.post('/sendInsure', function(req, res){
  console.log('hit received at sendInsure, with insure ID of', req.body.insureId);
  global.insureId= req.body.insureId;
  res.sendStatus(200);
});

app.get('/getInsureId', function(req, res){
  console.log('request received at getInsureId');
  return res.json(global.insureId);
});

app.get('/specificInsure', function(req, res){
//  var searchCaseMeta = ('SELECT * FROM cases_meta WHERE id=' + global.caseId);
console.log('request received at specific insure');
resultsSpecInsure = [];
pg.connect(connectionString, function(err, client, done){
  // if(err){
  //   console.log(err);
  // }
  // else
    var specificInsuranceQuery = ('SELECT * FROM insurers WHERE id='+global.insureId);
    console.log('we are sending over the query');
    console.log('SELECT * FROM insurers WHERE id='+global.insureId);
    var query = client.query(specificInsuranceQuery);
    query.on('row', function(row){
      resultsSpecInsure.push(row);
    });
    query.on('end', function(){
      done();
      console.log('and the results from specific insure will be', resultsSpecInsure);
      return res.json(resultsSpecInsure);
    });

});
});

//
//
//
// app.get('/getCases', function(req, res){
//   console.log("Get case request received!");
//   resultsCase = [];
//   pg.connect(connectionString, function(err, client, done){
//     var searchCases = ('SELECT * FROM cases_meta WHERE client_id=' + global.clientId);
//     console.log("we are sending over the query");
//     console.log('SELECT * FROM cases_meta WHERE client_id=' + global.clientId);
//     var query = client.query(searchCases);
//     query.on('row', function(row){
//       resultsCase.push(row);
//     });
//     query.on('end', function(){
//       done();
//       console.log(resultsCase);
//       return res.json(resultsCase);
//     });
//     if(err){
//       console.log(err);
//     }
//   });
// });



app.get('/getLastVal', function(req, res){console.log("Get case request received!");
getVal = [];
pg.connect(connectionString, function(err, client, done){
  if(err){
    console.log(err);
  }
  else {
    var getValQuery = ('select id from cases_meta ORDER BY id DESC limit 1');
    console.log("we are sending over the query");
    console.log(getValQuery);
    var query = client.query(getValQuery);
    query.on('row', function(row){
      getVal.push(row);
    });
    query.on('end', function(){
      done();
      console.log('and the results for case meta information will be...');
      console.log(getVal[0].id);
      global.caseId = getVal[0].id;
      return res.json(getVal);
      });
    }
  });
});

app.post('/caseParams', function(req, res){
  console.log("Request Received to go to a case");
  console.log(req.body.case_id);
  global.caseId= req.body.case_id;
  res.sendStatus(200);
});

app.post('/newCaseNote', function(req, res){
  // console.log('note title is ', req.body.noteTitle , 'and the author is ', req.body.noteAuthor, ', and the body is ', req.body.noteContents);

pg.connect(connectionString, function(err, client, done){
  client.query('INSERT INTO cases_notes (case_id, title, note, author) VALUES ($1, $2, $3, $4)', [global.caseId, req.body.noteTitle, req.body.noteContents, req.body.noteAuthor ]);
  done();
});
});

app.get('/removeInsurer', function(req, res){
  console.log('Request received in removeInsurer');
  pg.connect(connectionString, function(err, client, done){
    client.query('DELETE FROM insurers WHERE id=' + global.insureId);
    done();
  });
  res.sendStatus(200);
});

app.post('/addInsurer', function(req, res){
  console.log('Request received in add Insurer');
  console.log(req.body.id, req.body.provider, req.body.first_name, req.body.last_name, req.body.phone, req.body.email, req.body.client_id, req.body.provider_type, req.body.notes, req.body.claim_number);

  pg.connect(connectionString, function(err, client, done){
    client.query ('INSERT INTO insurers (provider, first_name, last_name, phone, email, client_id, provider_type, notes, claim_number) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', [req.body.provider, req.body.first_name, req.body.last_name, req.body.phone, req.body.email, global.clientId, req.body.provider_type, req.body.notes, req.body.claim_number]);
    done();
  });
  res.sendStatus(200);

});


app.post('/caseStatusUpdate', function(req, res){
  console.log("request received to update status of case");
  console.log("UPDATE cases_meta SET status='" + req.body.status + "' WHERE id='"+ global.caseId+"'");

  pg.connect(connectionString, function(err, client, done){
    client.query("UPDATE cases_meta SET status='" + req.body.status + "' WHERE id='"+ global.caseId+"'");
    done();
  });
  res.sendStatus(200);
});


app.get('/getClosedCases', function(req, res){
  console.log('request received to get closed cases');
  resultsCase = [];
  pg.connect(connectionString, function(err, client, done){
    var searchCases = ("SELECT * FROM cases_meta WHERE client_id=" + global.clientId +" AND status='closed'");
    console.log("we are sending over the query");
    console.log("SELECT * FROM cases_meta WHERE client_id=" + global.clientId +" AND status='closed'");
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



app.get('/getOpenCases', function(req, res){
  console.log('request received to get open cases');
  resultsCase = [];
  pg.connect(connectionString, function(err, client, done){
    var searchCases = ("SELECT * FROM cases_meta WHERE client_id=" + global.clientId +" AND status='open'");
    console.log("we are sending over the query");
    console.log("SELECT * FROM cases_meta WHERE client_id=" + global.clientId +" AND status='open'");
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




app.get('/getCanceledCases', function(req, res){
  console.log('request received to get canceled cases');
  resultsCase = [];
  pg.connect(connectionString, function(err, client, done){
    var searchCases = ("SELECT * FROM cases_meta WHERE client_id=" + global.clientId +" AND status='canceled'");
    console.log("we are sending over the query");
    console.log("SELECT * FROM cases_meta WHERE client_id=" + global.clientId +" AND status='canceled'");
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


app.post('/updateClientInfos', function(req, res){
  console.log("Made it to Client Info Update");
  console.log(req.body.first_name);

  pg.connect(connectionString, function(err, client, done){
    client.query("UPDATE clients SET first_name='"+ req.body.first_name + "',  last_name='"+ req.body.last_name + "', address='"+ req.body.address + "', city='" + req.body.city + "', state='" + req.body.state + "', email='" + req.body.email+ "', phone='" + req.body.phone + "', address2='" + req.body.address2 + "'  WHERE id=" + req.body.id);
    done();
  });

  res.sendStatus(200);
});



app.get('/editClientInfo', function(req, res){
  res.sendFile(path.resolve('views/editClientInfo.html'));
});

app.get('/insureAdd', function(req, res){
  res.sendFile(path.resolve('views/insurerAdd.html'));
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

app.get('/360', function(req, res){
  res.sendFile(path.resolve('views/360.html'));
});

app.get('/caseCreate', function(req, res){
  res.sendFile(path.resolve('views/caseCreate.html'));
});

app.get('/caseAddNote', function(req, res){
  res.sendFile(path.resolve('views/caseAddNote.html'));
});

app.get('/insureEdit', function(req, res){
  res.sendFile(path.resolve('views/insureEdit.html'));
});

//Assign Static Folder
app.use( express.static('public'));
