const express = require("express");

// get the router method from express
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello");
});

router.get("/world", (req, res) => {
  res.send("World");
});

module.exports = router;
