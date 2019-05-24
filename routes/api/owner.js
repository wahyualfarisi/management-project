const express = require('express');
const Router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const db  = require('./../../config/db_config');

//import owner model
const Owner = require('./../../models/Owner');
const { check, validationResult } = require('express-validator/check');

/**
 *@desc: Register Owner
 *@method: POST
 *@url : /register
 */
Router.post('/register', [
    check('email', 'Email is required').isEmail(),
    check('fullname', 'Fullname is required').not().isEmpty(),
    check('password', 'Please Enter Password with 6 or more characters').isLength({ min: 6 })
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() })
    }

    const {email, fullname, password, githubusername, jobs } = req.body;
    try {
  
       db.query("SELECT * FROM t_owner WHERE email_owner = ? ", [email], (err, results, fields) => {
           if(err) return  res.status(500).send('Something wrong')
           if(results.length > 0) return res.status(400).json({ msg: 'Email already exist' })
           const avatar = gravatar.url(email, {
               s: '200',
               r: 'pg',
               d: 'mm'
           });

           const newOwner = {
               email_admin: email,
               fullname: fullname,
               password: password,
               githubusername: githubusername,
               jobs: jobs,
               avatar: avatar
           }

           //encrypt password
          bcrypt.genSalt(10, (err, salt) => {
               bcrypt.hash(newOwner.password, salt, (err, hash) => {
                   if(err) throw err;
                   newOwner.password = hash;
                   let sql = `INSERT INTO t_owner (id, email_owner, fullname, githubusername, jobs, password, avatar)
                              VALUES (
                                  '${uuid.v4()}',
                                  '${newOwner.email_admin}',
                                  '${newOwner.fullname}',
                                  '${newOwner.githubusername}',
                                  '${newOwner.jobs}',
                                  '${newOwner.password}',
                                  '${newOwner.avatar}'
                             )`;
                   db.query(sql, (err, results, fields) => {
                        if(err) throw err;
                        res.json({'msg' : 'success', code: 1});
                   })
               })
           })
       });
    } catch (err) {
        console.log(err);
    }
})

module.exports = Router;