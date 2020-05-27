"use strict";
const express = require("express");
const dbConfig = require("../config/database");
const sqlite = require("sqlite");
const getDb = require("../config/database").getDb;

// get the router method from express
const router = express.Router();

// checkout page
router.get("/checkout", (req, res) => {
  res.render("checkout");
});

// advertising page
router.get("/advertising", (req, res) => {
  res.render("advertising");
});

// All jewellery page
router.get("/all", async (req, res) => {
  try {
    const db = getDb();
    const jewellery = await db.all(`select * from jewellery`);
    res.render("jewellery/all", {
      jewellery: jewellery
    });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

// Load jewellery of a certain type
router.get("/:type", async (req, res) => {
  try {
    const ps = dbConfig.getSelectType();
    const jewellery = await ps.all(req.params.type);
    res.render("jewellery/list", {
      jewellery: jewellery,
      type: req.params.type
    });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

// get specific item page
router.get("/:type/:id", async (req, res) => {
  try {
    const ps = dbConfig.getSelectItem();
    const item = await ps.get(req.params.id);
    const ps2 = dbConfig.getSelectType();
    const similarProducts = await ps2.all(req.params.type);
    res.render("jewellery/item", {
      item: item,
      similarProducts: similarProducts
    });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

module.exports = router;
