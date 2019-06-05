const mysql = require("mysql");

const db_development = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "management_project"
});

const db_production  = mysql.createConnection({
  host: "localhost",
  user: "alfarisi_root",
  password: "wahyuais@#$@#$",
  database: "alfarisi_project"
});


// db.connect(function(err) {
//   if (err) throw err;
//   console.log("connected");
// });

module.exports = db_production ;
