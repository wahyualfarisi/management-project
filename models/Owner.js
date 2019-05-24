const db = require('./../config/db_config');

var Owner = {}

Owner.check = function check(email){
   db.query("SELECT * FROM t_owner", (err , result , fields ) => {
       return result;
   })

}


module.exports = Owner;