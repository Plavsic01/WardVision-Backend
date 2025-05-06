const express = require("express");
const router = express.Router();
const riot = require("../services/riotAPI");
const cache = require("../utils/cache");

router.get("/:region", async (req, res) => {
  try {
    const cachedData = cache.rotationCache.get("championRotation");

    if (cachedData) {
      console.log("Serving from rotation cache");
      return res.json(cachedData);
    }

    const championRotation = await riot.getChampionRotation(req.params.region);
    cache.rotationCache.set("championRotation", championRotation);
    console.log("Rotation Fetched from Riot API");

    return res.json(championRotation);
  } catch (error) {
    res.status(500).json({ error: "Error while getting champion rotation" });
  }
});

module.exports = router;
