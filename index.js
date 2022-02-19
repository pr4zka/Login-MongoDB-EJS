require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");


//port configuration
const port = process.env.PORT || 3000;


//configuracion de passport
const app = express();


//ejs configuration
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride("_method"));
//middlewares
app.use(morgan("dev"));
require("./database");



//Routes
app.use(require("./routes/routes"));

//server port
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});
