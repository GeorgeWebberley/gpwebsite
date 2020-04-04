const express = require("express");
const Jewellery = require("../models/Jewellery");

// get the router method from express
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/hello", (req, res) => {
  res.send("Hello World");
});

module.exports = router;
