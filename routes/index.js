var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');

// Handles login form POST from index.html
router.post('/',
    passport.authenticate('local', {
        successRedirect: '/views/user.html',
        failureRedirect: '/views/failure.html'
    })
);

// Handle index file separately
// Also catches any other request not explicitly matched elsewhere
router.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

module.exports = router;
