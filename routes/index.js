const express = require("express");

// get the router method from express
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.send("About");
});

module.exports = router;
