const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const pathUtils = require("../utils/pathUtils");
const { log } = require("console");

// GET ALL CHAMPIONS
router.get("/", async (req, res) => {
  try {
    const championsJSON = await pathUtils.findJSON("champions.json");

    const champions = await fs.readJSON(championsJSON);
    return res.json(champions);
  } catch (error) {
    res.status(500).json({ error: "Error while getting summoner details" });
  }
});

// GET BY NAME
router.get("/:championName", async (req, res) => {
  try {
    const { championName } = req.params;

    const championsJSON = await pathUtils.findJSON(
      `champions/${championName}.json`
    );

    const champions = await fs.readJSON(championsJSON);
    return res.json(champions["data"][championName]);
  } catch (error) {
    res.status(404).json({ error: "Error while getting summoner details" });
  }
});

router.get("/champion-icon/:id", async (req, res) => {
  const currentVersion = await pathUtils.getCurrentVersion();
  const filePath = path.join(
    __dirname,
    "..",
    "ddragon",
    `${currentVersion}`,
    "img",
    "champions",
    `${req.params.id}`
  );

  res.sendFile(filePath);
});

module.exports = router;
