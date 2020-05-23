"use strict";
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// ---- IMPORTS ----
const express = require("express"); // loads module 'express'
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const sqlite = require("sqlite");
// Handles some security by setting various HTTP headers
const helmet = require("helmet");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require("method-override");

// import and initialise passport
// const passport = require("passport");
// const initPassport = require("./config/passport");
// initPassport(passport, findUser(username));
//
// async function findUser(username) {
//   let user;
//   try {
//     const db = await sqlite.open("./db.sqlite");
//     user = await db.get(`select * from admin where username="${username}"`);
//   } catch (e) {
//     console.log(e);
//   }
//   return user;
// }

const passport = require("passport");
const initPassport = require("./config/passport");
initPassport(passport);

async function findUser(username) {
  let user;
  try {
    const db = await sqlite.open("./db.sqlite");
    user = await db.get(`select * from admin where username="${username}"`);
  } catch (e) {
    console.log(e);
  }
  return user;
}

// use port 3000 unless there exists a preconfigured port
const PORT = process.env.PORT || 3000;

// Initial function for setting up the database
create();

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
const indexRouter = require("./routes/index");
const jewelleryRouter = require("./routes/jewellery");
const adminRouter = require("./routes/admin");

// ---- DATABASE SETUP ----
async function create() {
  try {
    const db = await sqlite.open("./db.sqlite");
    const jewelleryTable = `
      CREATE TABLE IF NOT EXISTS jewellery (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255),
        type VARCHAR(255),
        price REAL,
        imageName TEXT,
        description TEXT)`;
    await db.run(jewelleryTable);
    const adminTable = `
      CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        passwordHash TEXT NOT NULL)`;
    await db.run(adminTable);
  } catch (e) {
    console.log(e);
  }
}

// set the index to be on '/', jewellery on '/jewellery' and admin on '/admin'
app.use("/", indexRouter);
app.use("/jewellery", jewelleryRouter);
app.use("/admin", adminRouter);

// ---- SERVER CONNECT ----

app.listen(PORT, () => {
  console.log(`Server running...`);
});
