const express = require("express");
const sqlite = require("sqlite");

// get the router method from express
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Jewellery");
});

router.get("/:type", async (req, res) => {
  try {
    const db = await sqlite.open("./db.sqlite");
    const jewellery = await db.all(
      "select * from jewellery where type=" + req.params.type
    );
  } catch (e) {
    console.log(e);
  }
  res.send("World");
});

module.exports = router;
