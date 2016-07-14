var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

// Handles Ajax request for user information if user is authenticated
router.get('/', function(req, res) {
  console.log('hit login page');
    // check if logged in
    if(req.isAuthenticated()) {
        // send back user object from database
        console.log('is authenticated');
        res.send(req.user);

    } else {
        // failure best handled on the server. do redirect here.
        console.log('is not authenticated');
        res.send(false);
    }
});


module.exports = router;
