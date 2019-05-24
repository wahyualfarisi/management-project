const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "management_project"
});

db.connect(function(err) {
  if (err) throw err;
  console.log("connected");
});

module.exports = db;
