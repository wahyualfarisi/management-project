const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const port = process.env.PORT || 8000;


const app = express();
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

// if(process.env.PORT) {
//   app.use(function(request, response){
//     if(!request.secure){
//       response.redirect("https://" + request.headers.host + request.url);
//     }
//   });
// }


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/static", express.static(path.join(__dirname ,"public" )));

app.set("view engine", "ejs");

/**
 * main url
 */

app.use("/", require("./routes/main"));

app.use('/owner', require('./routes/owner'));
// app.use('/dashboard', require('./routes/dashboard'))

/**
 *auth process
 */
// app.use("/auth", require("./routes/login"));



/**
 *API route 
 */
app.use('/api/owner', require('./routes/api/owner'));
app.use('/api/project', require('./routes/api/project'));


app.listen(port, () => {
  console.log("server running on port ", port);
});
