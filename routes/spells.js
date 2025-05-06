const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const pathUtils = require("../utils/pathUtils");

router.get("/spell/:id", async (req, res) => {
  const currentVersion = await pathUtils.getCurrentVersion();
  const filePath = path.join(
    __dirname,
    "..",
    "ddragon",
    `${currentVersion}`,
    "img",
    "spells",
    `${req.params.id}`
  );

  res.sendFile(filePath);
});

router.get("/passive/:id", async (req, res) => {
  const currentVersion = await pathUtils.getCurrentVersion();
  const filePath = path.join(
    __dirname,
    "..",
    "ddragon",
    `${currentVersion}`,
    "img",
    "passive",
    `${req.params.id}`
  );

  res.sendFile(filePath);
});

router.get("/summoner-spell/:id", async (req, res) => {
  const id = req.params.id;

  const sumSpellsJSON = await pathUtils.findJSON("summonerSpells.json");

  const sumSpells = await fs.readJSON(sumSpellsJSON);

  const spells = {};

  for (const [key, value] of Object.entries(sumSpells)) {
    spells[value["key"]] = key;
  }

  const currentVersion = await pathUtils.getCurrentVersion();
  const filePath = path.join(
    __dirname,
    "..",
    "ddragon",
    `${currentVersion}`,
    "img",
    "summonerSpells",
    `${spells[id]}.png`
  );

  res.sendFile(filePath);
});

module.exports = router;
