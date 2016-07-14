/*
CREATE TABLE users (
 id SERIAL PRIMARY KEY,
 username VARCHAR(100) NOT NULL UNIQUE,
 password VARCHAR(120) NOT NULL
);
*/

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var encryptLib = require('../modules/encryption');
var connection = require('../modules/connection');
var pg = require('pg');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  //TO DO SQL query
  console.log('called deserializeUser');
  pg.connect(connection, function (err, client, complete) {

    var user = {};
    console.log('called deserializeUser - pg');
      var query = client.query("SELECT * FROM users WHERE id = $1", [id]);

      query.on('row', function (row) {
        console.log('User row', row);
        user = row;
        done(null, user);
      });

      // After all data is returned, close connection and return results
      query.on('end', function () {
          complete();
      });

      // Handle Errors
      if (err) {
          console.log(err);
      }
  });
});

// Does actual work of logging in
passport.use('local', new localStrategy({
    passReqToCallback: true,
    usernameField: 'username'
    }, function(req, username, password, done){
	    pg.connect(connection, function (err, client) {
	    	console.log('called local - pg');
	    	var user = {};

        //QUERY BELOW DOES NOT REUTRN IF NOT IN DATABSE
        var query = client.query("SELECT * FROM users WHERE username = $1", [username]);
        console.log('the user is ', username);
        console.log('query is' , query);

        // Handle Errors
        if (err) {
            console.log(err);
        }
        query.on('row', function (row) {
        	console.log('User obj', row);
        	user = row;

          console.log('user is now ', user);
          console.log('user.password is ', user.password);
          console.log('password is ', password);

          // Hash and compare
          if(encryptLib.comparePassword(password, user.password)) {
            // all good!
            console.log('matched');
            done(null, user);
          } else {
            console.log('nope');
            done(null, false, {message: 'Incorrect credentials.'});
          }

        });

        // After all data is returned, close connection and return results
        query.on('end', function () {
            client.end();
        });


	    });
    }
));

module.exports = passport;
