const express = require("express");
const router = express.Router();
const riot = require("../services/riotAPI");
const getRegion = require("../utils/region");
const cache = require("../utils/cache");
const mapMatchInfo = require("../utils/matchInfo");

// LAST X MATCHES
router.get("/:region/:puuid/:start/:count", async (req, res) => {
  try {
    const { region, puuid, start, count } = req.params;

    const CACHE_KEY = `${region}_${start}_${count}_${puuid}_match_history`;

    const cachedData = cache.matchHistoryCache.get(CACHE_KEY);

    if (cachedData) {
      console.log("Serving from match history cache");
      return res.json(cachedData);
    }

    const formattedRegion = getRegion(region);

    const matchHistory = await riot.getMatchHistory(
      formattedRegion,
      puuid,
      start,
      count
    );

    const mappedMatches = [];

    const results = await Promise.allSettled(
      matchHistory.map((matchId) => riot.getMatch(formattedRegion, matchId))
    );

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        // console.log(`Success ${index}:`);
        mappedMatches.push(mapMatchInfo(result.value, puuid));
      } else {
        console.error(`Error ${index}:`, result.reason);
      }
    });

    cache.matchHistoryCache.set(CACHE_KEY, mappedMatches);
    console.log("Match - History Fetched from Riot API");
    return res.json(mappedMatches);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Error while getting match history" });
  }
});

module.exports = router;
