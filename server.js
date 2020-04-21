"use strict";
// ---- IMPORTS ----
const express = require("express"); // loads module 'express'
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const sqlite = require("sqlite");
// Handles some security by setting various HTTP headers
const helmet = require("helmet");
app.use(helmet());

create();

// ---- APP SETUP ----
// set the view engine to ejs
app.set("view engine", "ejs");
// Tell the app where views folder is.
app.set("views", __dirname + "/views");
// sets the 'layout' (i.e. the html template which contains header, footer etc) to the layout file in layouts folder
app.set("layout", "layouts/layout");
app.use(expressLayouts);
// tells express where our public files will be.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: false }));

const indexRouter = require("./routes/index");
const jewelleryRouter = require("./routes/jewellery");

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
  } catch (e) {
    console.log(e);
  }
}

// set the index to be on '/' and jewellery on'/jewellery
app.use("/", indexRouter);
app.use("/jewellery", jewelleryRouter);

// ---- SERVER CONNECT ----
app.listen(3000, () => {
  console.log(`Server running...`);
});
