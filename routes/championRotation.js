const express = require("express");
const router = express.Router();
const riot = require("../services/riotAPI");
const cache = require("../utils/cache");
const fs = require("fs-extra");
const pathUtils = require("../utils/pathUtils");
const championUtils = require("../utils/championInfo");
const getNextRotationDate = require("../utils/championRotation");

router.get("/:region", async (req, res) => {
  try {
    const cachedData = cache.rotationCache.get("championRotation");

    if (cachedData) {
      console.log("Serving from rotation cache");
      return res.json(cachedData);
    }

    // FETCHING ROTATION DATA
    const championRotation = await riot.getChampionRotation(req.params.region);
    // FINDING JSON CHAMPIONS FILE
    const championsJSON = await pathUtils.findJSON("champions.json");
    // READING CHAMPIONS JSON FILE
    const champions = await fs.readJSON(championsJSON);

    // MAPPING TO FORMATTED CHAMPIONS DATA
    const mappedChampionRotation = championUtils.mapChampionsInfo(champions);

    const freeChampions = championRotation.freeChampionIds;

    const formattedFreeChampions = [];

    freeChampions.forEach((championKey) => {
      mappedChampionRotation.forEach((champion) => {
        if (Number(champion.key) === championKey) {
          formattedFreeChampions.push(champion);
        }
      });
    });

    const champRotationObj = {
      freeChampions: formattedFreeChampions,
      nextRotation: getNextRotationDate(),
    };

    cache.rotationCache.set("championRotation", champRotationObj);
    console.log("Rotation Fetched from Riot API");

    return res.json(champRotationObj);
  } catch (error) {
    res.status(500).json({ error: "Error while getting champion rotation" });
  }
});

module.exports = router;
