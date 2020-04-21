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
      `select * from jewellery where type="${req.params.type}"`
    );
    res.render("jewellery/list", {
      jewellery: jewellery,
      type: req.params.type
    });
  } catch (e) {
    console.log(e);
    res.redirect("/");
  }
});

router.get("/:type/:id", async (req, res) => {
  try {
    const db = await sqlite.open("./db.sqlite");
    const item = await db.get(
      `select * from jewellery where rowid="${req.params.id}"`
    );
    const similarProducts = await db.all(
      `select * from jewellery where type="${req.params.type}"`
    );
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
