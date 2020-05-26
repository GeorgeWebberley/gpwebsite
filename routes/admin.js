"use strict";
const express = require("express");
require("dotenv").config();
// get the router method from express
const router = express.Router();
// const sqlite = require("sqlite");
// const getDb = require("../config/database").getDb;
const dbConfig = require("../config/database");
const bcrypt = require("bcrypt");
const passport = require("passport");
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

router.get("/login", checkNotAdmin, (req, res) => {
  res.render("admin/login");
});

router.get("/register", checkNotAdmin, (req, res) => {
  res.render("admin/register");
});

router.post(
  "/login",
  checkNotAdmin,
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/admin/login",
    failureFlash: true
  })
);

router.post("/register", checkNotAdmin, async (req, res) => {
  const { username, password, password2, master } = req.body;
  const errors = checkFields(username, password, password2, master);
  if (errors.length > 0) {
    // the second argument here (the object) are variables we want to pass in when rendering the page
    res.render("admin/register", {
      errors,
      username,
      password,
      password2,
      master
    });
  } else {
    try {
      // const db = dbConfig.getDb();
      // Check if user exists
      const ps = dbConfig.getCountUsers();
      const user = await ps.get(username);
      // const user = await db.get(
      //   `select count(1) as c from admin where username="${username}"`
      // );
      // If user exists, render register page with error.
      if (user.c > 0) {
        errors.push({ msg: "A user with that username already exists." });
        res.render("admin/register", {
          errors,
          username,
          password,
          password2,
          master
        });
      } else {
        // Else, we can hash the password and insert new admin into database
        const passwordHash = await bcrypt.hash(password, 10);
        const ps = dbConfig.getInsertAdmin();
        await ps.run(username, passwordHash);
        res.render("admin/login", {
          success: "Account made successfully! You can now login."
        });
      }
    } catch (e) {
      console.log(e);
      res.redirect("/admin/register");
    }
  }
});

router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/admin/login");
});

router.get("/", checkAdmin, (req, res) => {
  res.render("admin/manageItems");
});

router.get("/addItem", checkAdmin, (req, res) => {
  res.render("admin/addItem");
});

router.post("/addItem", upload.single("image"), async (req, res) => {
  try {
    const ps = dbConfig.getInsertItem();
    await ps.run(
      req.body.name,
      req.body.type,
      req.body.price,
      req.file.filename,
      req.body.description
    );
    // await db.run(`insert into jewellery values (
    // NULL,
    // "${req.body.name}",
    // "${req.body.type}",
    // ${req.body.price},
    // "${req.file.filename}",
    // "${req.body.description}")`);
    res.render("admin/addItem", {
      success: "Success! Item added to database."
    });
  } catch (e) {
    console.log(e);
    res.render("admin/addItem", {
      errorMessage: "Something went wrong. Please try again."
    });
  }
});

router.get("/removeItem", checkAdmin, async (req, res) => {
  try {
    const db = dbConfig.getDb();
    const jewellery = await db.all(`select * from jewellery ORDER BY name`);
    res.render("admin/removeItem", {
      jewellery: jewellery
    });
  } catch (e) {
    console.log(e);
    res.redirect("/admin/manageItems");
  }
});

router.delete("/removeItem/:id", checkAdmin, async (req, res) => {
  try {
    const ps = dbConfig.getSelectItem();
    const item = await ps.get(req.params.id);
    // const item = await db.get(
    //   `SELECT * FROM jewellery WHERE id=${req.params.id}`
    // );
    const ps2 = dbConfig.getDeleteItem();
    ps2.run(req.params.id);
    // await db.get(`DELETE FROM jewellery WHERE id=${req.params.id}`);
    removeImage(item.imageName);
    const db = dbConfig.getDb();
    const jewellery = await db.all(`select * from jewellery ORDER BY name`);
    res.render("admin/removeItem", {
      jewellery: jewellery
    });
  } catch (e) {
    console.log(e);
    res.redirect("/admin/manageItems");
  }
});

router.get("/editItem/:id", checkAdmin, async (req, res) => {
  try {
    // const db = dbConfig.getDb();
    const ps = dbConfig.getSelectItem();
    const item = await ps.get(req.params.id);
    // const item = await db.get(
    //   `select * from jewellery WHERE id=${req.params.id}`
    // );
    res.render("admin/editItem", {
      item: item
    });
  } catch (e) {
    console.log(e);
    res.redirect("/admin/manageItems");
  }
});

router.put("/editItem/:id", upload.single("image"), async (req, res) => {
  try {
    const ps = dbConfig.getSelectItem();
    let oldItem = await ps.get(req.params.id);
    // let oldItem = await db.get(
    //   `select * from jewellery WHERE id=${req.params.id}`
    // );
    let imageName = oldItem.imageName;
    if (req.file != null && req.file !== "") {
      removeImage(imageName);
      imageName = req.file.filename;
    }
    const ps2 = dbConfig.getEditItem();
    await ps2.run(
      req.body.name,
      req.body.type,
      req.body.price,
      imageName,
      req.body.description,
      req.params.id
    );
    // const item = await db.run(
    //   `UPDATE jewellery SET
    //       name="${req.body.name}",
    //       type="${req.body.type}",
    //       price=${req.body.price},
    //       imageName="${imageName}",
    //       description="${req.body.description}"
    //       WHERE id=${req.params.id}`
    // );
    const db = dbConfig.getDb();
    const jewellery = await db.all(`select * from jewellery ORDER BY name`);
    res.render("admin/removeItem", {
      jewellery: jewellery
    });
  } catch (e) {
    console.log(e);
    res.redirect("/admin/manageItems");
  }
});

function checkFields(username, password, password2, master) {
  let errors = [];
  // Check required fields
  if (!username || !password || !password2 || !master) {
    errors.push({ msg: "Please fill in all fields" });
  }
  // Check passwords match
  if (password !== password2) {
    errors.push({ msg: "Passwords don't match" });
  }
  // Check password is 6 characters long
  if (password.length < 6) {
    errors.push({ msg: "Password should be at least 6 characters" });
  }
  if (master !== process.env.MASTER) {
    errors.push({ msg: "Master password is incorrect" });
  }
  return errors;
}

// async function insertAdmin(username, passwordHash) {
//   try {
//     const db = getDb(sqlite);
//     await db.run(`insert into admin values (
//       NULL,
//       "${username}",
//       "${passwordHash}")`);
//   } catch (e) {
//     console.log(e);
//   }
// }
//

// Function to remove the image file when item is deleted or edited
function removeImage(fileName) {
  // unlink here removes the file
  fs.unlink("public/db_images/" + fileName, function(e) {
    if (e) {
      console.log(e);
    }
  });
}

function checkNotAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/admin");
  }
  next();
}

function checkAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/admin/login");
}

module.exports = router;
