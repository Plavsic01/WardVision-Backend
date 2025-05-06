const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const pathUtils = require("../utils/pathUtils");

//  GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const itemsJSON = await pathUtils.findJSON("items.json");

    const items = await fs.readJSON(itemsJSON);
    return res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Error while getting summoner details" });
  }
});

// GET BY NAME
router.get("/:itemName", async (req, res) => {
  try {
    const { itemName } = req.params;

    const itemsJSON = await pathUtils.findJSON("items.json");

    const items = await fs.readJSON(itemsJSON);
    return res.json(items[itemName]);
  } catch (error) {
    res.status(404).json({ error: "Error while getting summoner details" });
  }
});

router.get("/item-icon/:id", async (req, res) => {
  const currentVersion = await pathUtils.getCurrentVersion();
  const filePath = path.join(
    __dirname,
    "..",
    "ddragon",
    `${currentVersion}`,
    "img",
    "items",
    `${req.params.id}`
  );

  res.sendFile(filePath);
});

module.exports = router;
