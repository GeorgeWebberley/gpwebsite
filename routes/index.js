const express = require("express");

// get the router method from express
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.send("About");
});

router.get("/admin", (req, res) => {
  res.render("admin");
});

module.exports = router;
