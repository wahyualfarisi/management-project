const express = require('express');
const Route = express.Router();
const auth = require('./../../middleware/auth');
const db = require('./../../config/db_config');




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


module.exports = Route;
