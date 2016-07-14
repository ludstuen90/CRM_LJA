var express = require('express');
var router = express.Router();
var passport = require('passport');
// var Users = require('../models/user');
var path = require('path');

// module with bcrypt functions
var encryptLib = require('../modules/encryption');
var connection = require('../modules/connection');
var pg = require('pg');

// Handles request for HTML file
router.get('/', function(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/register.html'));
});

// Handles POST request with new user data
router.post('/', isAuthenticated,   function(req, res, next) {
  console.log("the password is ", req.body.password);

  var saveUser = {
    username: req.body.username,
    password: encryptLib.encryptPassword(req.body.password)
  };
  console.log('new user:', saveUser);

  pg.connect(connection, function(err, client, done) {
    client.query("INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id",
      [saveUser.username, saveUser.password],
        function (err, result) {
          client.end();

          if(err) {
            console.log("Error inserting data: ", err);
            next(err);
          } else {
            res.redirect('/');
          }
        });
  });

});

function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user.username === null){
        res.redirect('/360');
    }

    if (req.user.username !== undefined)
        return next();
    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    res.redirect('/');
}

module.exports = router;
