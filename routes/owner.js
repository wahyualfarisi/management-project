const express = require('express');
const Route = express.Router();


Route.get('/', (req, res) => {
  if(req.session.loggedIn){
    return res.render('main', {
      avatar: req.session.avatar
    });
  }
  res.redirect('/')
    
})

Route.get("/dashboard", (req, res) => {
  return res.render('pages/home')
 });

 Route.get("/activity", (req, res) => {
  return res.render('pages/activity')
 });

 Route.get("/setting", (req, res) => {
  return res.render('pages/form/formsetting')
 });




module.exports = Route;