"use strict";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// ---- IMPORTS ----
const express = require("express"); // loads module 'express'
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
// Handles some security by setting various HTTP headers
const helmet = require("helmet");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");
// ---- DATABASE SETUP ----
const sqlite = require("sqlite");
const initDb = require("./config/database").initDb;
// Initial function for connecting to database. Creates tables if not yet created.
initDb(sqlite);

// ---- PASSPORT SETUP ----
const passport = require("passport");
const initPassport = require("./config/passport");
// Configures passport so that it can be used for confirming users and passwords.
initPassport(passport);

// use port 3000 unless there exists a preconfigured port
const PORT = process.env.PORT || 3000;

// ---- APP SETUP ----
app.use(helmet());
// set the view engine to ejs
app.set("view engine", "ejs");
// Tell the app where the 'views' folder is.
app.set("views", __dirname + "/views");
// sets the 'layout' (i.e. the html template which contains header, footer etc) to the layout file in layouts folder
app.set("layout", "layouts/layout");
app.use(expressLayouts);
// tells express where our public files will be.
app.use(express.static("public"));
// Allows us to use 'DELETE' requests in forms
app.use(methodOverride("_method"));
// tells bodyparser to parse urlencoded bodies and only look at requests where the Content-Type header matches the type option
// accepts only UTF-8 encoding of body. POST limit increased to 10mb.
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));
// allows use of flash messages
app.use(flash());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // 'false' means we wont resave our session variables if nothing changes
    saveUninitialized: false // 'false' means we won't save an empty value if it is not initialised
  })
);
// Initializes basic passport features
app.use(passport.initialize());
// saves our session variables accross the application
app.use(passport.session());
// Middleware function that checks if user is logged in and sets a variable if they are.
app.use(function (req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

const indexRouter = require("./routes/index");
const jewelleryRouter = require("./routes/jewellery");
const adminRouter = require("./routes/admin");

// set the index to be on '/', jewellery on '/jewellery' and admin on '/admin'
app.use("/", indexRouter);
app.use("/jewellery", jewelleryRouter);
app.use("/admin", adminRouter);

// ---- SERVER CONNECT ----

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});
