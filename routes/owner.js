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

 Route.get('/project', (req, res) => {
   return res.render('pages/project')
 });

 Route.get('/create-project', (req, res) => {
   return res.render('pages/form/form-create-project')
 });

 Route.get('/change-password', (req, res) => res.render('pages/form/form-change-password'));

 Route.get('/invite-team', (req, res) => res.render('pages/form/form-invite-team'));

 Route.get("/setting", (req, res) => {
  return res.render('pages/form/formsetting')
 });




module.exports = Route;