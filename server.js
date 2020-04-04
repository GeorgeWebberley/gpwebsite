// if we are not in production we want to load our local environment variables from the dot file .env
// if (process.env.NODE_ENV !== "production") {
//   require("dotenv").config();
// }

// ---- IMPORTS ----
const express = require("express"); // loads module 'express'
const app = express();
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");

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
const mongoose = require("mongoose");
// mongoose.connect(process.env.DATABASE_URL, {
mongoose.connect("mongodb://localhost/gpwebsite", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const db = mongoose.connection;
// 'on' is like an event listener. So if error...
db.on("error", err => console.error(err));
// 'once' means it will only do it once (in this case, upon opening database for the first time)
db.once("open", () => console.log("Connected to Mongoose..."));

// ---- SERVER CONNECT ----
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running...`);
});
