const express = require('express');
const Router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const uuid = require('uuid');
const db  = require('./../../config/db_config');
const config = require('config');
const request = require('request');
const auth = require('./../../middleware/auth');
const { check, validationResult } = require('express-validator/check');

/**
 *@desc UPDATE PROFILE 
 *@method POST
 */

Router.post('/updateprofile', [
    auth,
    check('fullname', 'Fullname is required').not().isEmpty()
    ], (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty() ) return res.status(400).json({ errors: errors.array() })

        try {
            db.query('SELECT * FROM t_owner WHERE email_owner = ?', [req.user.email], (err, results) => {
                if(err) throw err;
                if(results.length === 1) {
                    const { fullname, githubusername, jobs } = req.body;
                    let sql = ` UPDATE t_owner SET
                                fullname = '${fullname}',
                                githubusername = '${githubusername}',
                                jobs = '${jobs}'
                                WHERE id = '${results[0].id}'
                              `;
                    db.query(sql, (err, results) => {
                        if(err) return res.status(400).json({ msg: 'something wrong' })
                        req.session.destroy(err => {
                            res.json({ code: 1, msg: 'update success, please sign in agaian' })
                        })
                        

                    })
                }else{
                    res.send('error')
                }
            })
        } catch (err) {
            console.log(err);
            res.status(500).send('server error')
        }
});



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
});


/**
 * @desc Login owner
 * @method POST /login
 */

Router.post('/login', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').not().isEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty() ){
        return res.status(400).json({ errors: errors.array() })
    }
    const {email , password } = req.body;

    try {
        db.query("SELECT * FROM t_owner WHERE email_owner = ? ", [email], (err, results, fields) => {
            if(err) return  res.status(500).send('Something wrong')
            
            if(results.length === 0) {
                errors.email = 'User not found';
                return res.status(404).json([errors])
            }
            bcrypt.compare(password, results[0].password).then(isMatch => {
                if(isMatch){
                    //create payload 
                    const payload = {
                         id:results[0].id, 
                         email: results[0].email_owner,
                         name: results[0].fullname, 
                         avatar: results[0].avatar  
                    }

                    jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600}, (err, token) => {
                        if(err) throw err;
                        
                        req.session.loggedIn = true;
                        req.session.fullname = results[0].fullname;
                        req.session.email = results[0].email;
                        req.session.avatar = results[0].avatar;
                        req.session.githubusername = results[0].githubusername

                        res.json({
                            token,
                            email: results[0].email,
                            githubusername: results[0].githubusername,
                            msg: 'Login Success',
                            login: true
                        })
                    })
                }else{
                    res.json({ msg: 'Email And password incorrect !' })
                }

            })
        })


    } catch (err) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

/**
 *@desc check current user 
 *@method GET
 */

Router.get('/current', auth, (req, res) => {
    try {
        db.query("SELECT id, email_owner, fullname, avatar, githubusername, jobs FROM t_owner WHERE email_owner = ? ", [req.user.email], (err, results, fields) => {
            if(err) return res.status(400).json({ msg: 'something wrong' })
            res.json(results);
        })
    } catch (err) {
        console.log(err);
        res.status(500).send('server error')
    }
});

/**
 *@desc fetch github repository
 *@method GET
 */

Router.get('/github/:username', (req, res) => {
    const options = {
        uri: `https://api.github.com/users/${req.params.username}/repos?per_page=15&sort=created:asc&client_id=${config.get("githubClientId")}&client_secret=${config.get("githubClientSecret")}`,
        method: 'GET',
        headers: { "user-agent": "node.js"}
    };

    request(options, (err, response, body) => {
        if(err) return  res.json(err);

        if(response.statusCode !== 200) return  res.status(400).json({ msg: 'No Github Profile' })

        res.json(JSON.parse(body))
    })

})

/**
 *@desc Change password
 *@method POST
 */
 Router.post('/change-password', [
     auth,
     check('current_password', 'Current password is required').not().isEmpty()
 ], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() } );

    const { current_password } = req.body;
    try {
        let sql = `SELECT * FROM t_owner WHERE email_owner = '${req.user.email}' `;
        db.query(sql, (err, results) => {
            if(err) return res.status(400).send('Something wrong');

            if(results.length === 0) return  res.status(400).json({ msg: 'owner not found' });

            bcrypt.compare(current_password, results[0].password).then(isMatch => {
                if(!isMatch) return res.status(400).json({ msg: 'Password not match' });
                res.json({ status: 1, msg: 'Password Confirmed ' })
            })

        })
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
 });

 /**
 *@desc Replace password
 *@method POST
 */
 Router.post('/replace-password', [
     auth, 
     check('password', 'Password is required').not().isEmpty(),
     check('confirm_password', 'Confirm password is required').not().isEmpty()
 ], (req, res) => {
     const errors = validationResult(req);
     if(!errors.isEmpty()) return  res.status(400).json({ errors: errors.array() })

     const { password, confirm_password } = req.body

     const newPassword = {
         password: password
     }

     try {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) throw err;
                newPassword.password = hash;
                console.log(newPassword.password)
                let sql = `UPDATE t_owner SET password = '${newPassword.password}' WHERE email_owner = '${req.user.email}'`;
                db.query(sql, (err, results) => {
                    if(err) return res.status(400).json({ msg: 'Something wrong' });

                    res.json({ status: 1, msg: 'Password has been changed , Please Sign in again ' });
                })

            })
        })
     } catch (err) {
         console.log(err);
         res.status(500).send('Server Error');
     }


 })






module.exports = Router;