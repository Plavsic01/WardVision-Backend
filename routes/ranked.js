const express = require("express");
const router = express.Router();
const riot = require("../services/riotAPI");
const cache = require("../utils/cache");
const mapRankedInfo = require("../utils/rankedInfo");
const path = require("path");

router.get("/icon/:tier", async (req, res) => {
  const filePath = path.join(
    __dirname,
    "..",
    "rankedIcons",
    `${req.params.tier.toLowerCase()}.png`
  );

  res.sendFile(filePath);
});

router.get("/:region/:puuid", async (req, res) => {
  try {
    const { region, puuid } = req.params;

    const CACHE_KEY = `${region}_${puuid}_ranked_stats`;

    const cachedData = cache.rankedCache.get(CACHE_KEY);

    if (cachedData) {
      console.log("Serving from ranked stats cache");
      return res.json(cachedData);
    }

    const rankedStats = await riot.getRankedStats(region, puuid);

    let soloData = null;
    let flexData = null;

    if (rankedStats.length > 0) {
      for (const entry of rankedStats) {
        if (entry.queueType === "RANKED_SOLO_5x5") {
          soloData = entry;
        } else if (entry.queueType === "RANKED_FLEX_SR") {
          flexData = entry;
        }
      }
    }

    const rankedJSON = [
      mapRankedInfo("Ranked Solo/Duo", soloData),
      mapRankedInfo("Ranked Flex", flexData),
    ];

    cache.rankedCache.set(CACHE_KEY, rankedJSON);
    console.log("Ranked Stats Fetched from Riot API");
    return res.json(rankedJSON);
  } catch (error) {
    res.status(error.status).json({ error: "Error while getting ranked data" });
  }
});

module.exports = router;
