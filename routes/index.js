"use strict";
const express = require("express");

// get the router method from express
const router = express.Router();
const sqlite = require("sqlite");
// allows us to deal with image objects and save them
const multer = require("multer");
// Allows us to use path.join to make the path for our image files (see uploadPath)
const path = require("path");
const fs = require("fs");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

// multer config
const upload = multer({
  dest: "public/db_images/",
  // allows us to specify what files we will accept.
  fileFilter: (req, file, callback) => {
    // first argument is for error, second is a boolean.
    // The boolean is checking whether the file type is in the imageMimeTypes array
    callback(null, imageMimeTypes.includes(file.mimetype));
  }
});

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/admin", (req, res) => {
  res.render("admin");
});

router.post("/admin", upload.single("image"), async (req, res) => {
  try {
    const db = await sqlite.open("./db.sqlite");
    // Set the id to null so that it will auto-increment
    await db.run(`insert into jewellery values (
      NULL,
      "${req.body.name}",
      "${req.body.type}",
      ${req.body.price},
      "${req.file.filename}",
      "${req.body.description}")`);
    res.render("admin", {
      successMessage: "Success! Item added to database."
    });
  } catch (e) {
    console.log(e);
    res.render("admin", {
      errorMessage: "Something went wrong. Please try again."
    });
  }
});

module.exports = router;
