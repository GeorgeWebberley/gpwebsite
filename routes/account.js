"use strict";
const express = require("express");
require("dotenv").config();
// get the router method from express
const router = express.Router();
const sqlite = require("sqlite");
const bcrypt = require("bcrypt");
const passport = require("passport");

router.get("/login", checkNotAdmin, (req, res) => {
  res.render("account/login");
});

router.get("/register", checkNotAdmin, (req, res) => {
  res.render("account/register");
});

router.post(
  "/login",
  checkNotAdmin,
  passport.authenticate("local", {
    successRedirect: "/admin",
    failureRedirect: "/account/login",
    failureFlash: true
  })
);

router.post("/register", checkNotAdmin, async (req, res) => {
  const { username, password, password2, master } = req.body;
  const errors = checkFields(username, password, password2, master);
  if (errors.length > 0) {
    // the second argument here (the object) are variables we want to pass in when rendering the page
    res.render("account/register", {
      errors,
      username,
      password,
      password2,
      master
    });
  } else {
    try {
      const db = await sqlite.open("./db.sqlite");
      // Check if user exists
      const user = await db.get(
        `select count(1) as c from admin where username="${username}"`
      );
      // If user exists, render register page with error.
      if (user.c > 0) {
        errors.push({ msg: "A user with that username already exists." });
        res.render("account/register", {
          errors,
          username,
          password,
          password2,
          master
        });
      } else {
        // Else, we can hash the password and insert new admin into database
        const passwordHash = await bcrypt.hash(password, 10);
        insertAdmin(db, username, passwordHash);
        res.redirect("/account/login");
      }
    } catch (e) {
      console.log(e);
      res.redirect("/register");
    }
  }
});

router.delete("/logout", (req, res) => {
  req.logOut();
  res.redirect("/account/login");
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

async function insertAdmin(db, username, passwordHash) {
  try {
    await db.run(`insert into admin values (
      NULL,
      "${username}",
      "${passwordHash}")`);
  } catch (e) {
    console.log(e);
  }
}

function checkNotAdmin(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/admin");
  }
  next();
}

module.exports = router;
