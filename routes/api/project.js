const express = require('express');
const Route = express.Router();
const auth = require('./../../middleware/auth');
const db = require('./../../config/db_config');
const uuid = require('uuid');
const { check, validationResult  } = require('express-validator/check');


Route.get('/', auth, (req, res) => {
    try {
        db.query("SELECT * FROM t_project WHERE email_owner =  ?", [req.user.email], (err, result, fields) => {
            if(err) throw err;
            res.json(result);
        })
    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
    }
});

Route.post('/',[
    auth,
    check('start_day', 'Start day is required').not().isEmpty(),
    check('finish_day', 'Finish Day is required').not().isEmpty(),
    check('name_project', 'Name Of Project is required').not().isEmpty(),
    check('githubrepo', 'Url is not valid').not().isEmpty().isURL(),
    check('status_project', 'Status project is required').not().isEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { start_day, finish_day, name_project, githubrepo, status_project } = req.body;

    const newProject = {
        kode_project: uuid.v4(),
        start_day: start_day,
        finish_day: finish_day,
        name_of_project: name_project,
        githubrepo: githubrepo,
        status_project: status_project,
        email_owner: req.user.email
    }
    
    try {
        let sql = `
                  INSERT INTO t_project 
                    (kode_project, start_day, finish_day,name_of_project, githubrepo, status_project, email_owner) 
                  VALUES
                    (
                        '${newProject.kode_project}',
                        '${newProject.start_day}',
                        '${newProject.finish_day}',
                        '${newProject.name_of_project}',
                        '${newProject.githubrepo}',
                        '${newProject.status_project}',
                        '${newProject.email_owner}'
                    )`;
                    db.query(sql, (err, results) => {
                        if(err) return res.status(500).send('something wrong ..')
                        res.json({ status: 1, msg: 'project created' });
                    })
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
})


module.exports = Route;
