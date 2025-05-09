const express = require("express");
const router = express.Router();
const fs = require("fs-extra");
const path = require("path");
const pathUtils = require("../utils/pathUtils");
const championUtils = require("../utils/championInfo");
// GET ALL CHAMPIONS
router.get("/", async (req, res) => {
  try {
    const championsJSON = await pathUtils.findJSON("champions.json");

    const champions = await fs.readJSON(championsJSON);
    const mappedChampions = championUtils.mapChampionsInfo(champions);
    return res.json(mappedChampions);
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

    const champion = await fs.readJSON(championsJSON);
    const mappedChampion = championUtils.mapChampionDetails(
      champion["data"][championName]
    );
    return res.json(mappedChampion);
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
