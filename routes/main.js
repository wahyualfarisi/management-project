const express = require("express");
const Route = express.Router();

Route.get("/", (req, res) => {
 if(!req.session.loggedIn){
   return res.render('pages/authentication/auth')
 }
 res.redirect('/owner')
 
});




Route.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  })
})

module.exports = Route;
