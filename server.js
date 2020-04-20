// if we are not in production we want to load our local environment variables from the dot file .env
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }
"use strict";
// ---- IMPORTS ----
const express = require("express"); // loads module 'express'
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const sqlite = require("sqlite");
create();

// ---- APP SETUP ----
// set the view engine to ejs
app.set("view engine", "ejs");
// Tell the app where views folder is (So dont have to keep typing /views/file)
app.set("views", __dirname + "/views");
// sets the 'layout' (i.e. the html template which contains header, footer etc) to the layout file in layouts folder
app.set("layout", "layouts/layout");
// explicityly declares we will be useing express-ejs-layouts
app.use(expressLayouts);
// tells express where our public files will be (i.e. in a folder called public)
app.use(express.static("public"));

const indexRouter = require("./routes/index");
// set the index to be on '/'
app.use("/", indexRouter);

const jewelleryRouter = require("./routes/jewellery");
app.use("/jewellery", jewelleryRouter);

// ---- DATABASE SETUP ----
async function create() {
  try {
    const db = await sqlite.open("./db.sqlite");

    await db.run(
      "create table if not exists jewellery (id, name, type, price)"
    );
  } catch (e) {
    console.log(e);
  }
}

// ---- SERVER CONNECT ----
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running...`);
});
