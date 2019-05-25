const express = require("express");
const Route = express.Router();

Route.get("/", (req, res) => {
 return res.render('pages/authentication/auth')
});




Route.get('/logout', (req, res) => {
  req.session.destroy(err => {
    res.redirect('/');
  })
})

module.exports = Route;
