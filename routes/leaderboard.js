const express = require("express");
const router = express.Router();
const riot = require("../services/riotAPI");
const mapRankedInfo = require("../utils/rankedInfo");
const cache = require("../utils/cache");

// CHALLENGER LEADERBOARD
router.get("/:region/:queueType", async (req, res) => {
  try {
    const { region, queueType } = req.params;

    let formattedQueueType = "";

    if (queueType === "solo") {
      formattedQueueType = "RANKED_SOLO_5x5";
    } else if (queueType === "flex") {
      formattedQueueType = "RANKED_FLEX_SR";
    }

    const CACHE_KEY = `${region}_${formattedQueueType}_leaderboard`;

    const cachedData = cache.leaderboardCache.get(CACHE_KEY);

    if (cachedData) {
      console.log("Serving from Leaderboard cache");
      return res.json(cachedData);
    }

    const leaderboard = await riot.getChallengerLeaderboard(
      region,
      formattedQueueType
    );

    const playersLeaderboard = [];

    leaderboard?.entries
      .slice(0, 100)
      .forEach((rankInfo, indx) =>
        playersLeaderboard.push(
          mapRankedInfo(formattedQueueType, rankInfo, true, indx + 1)
        )
      );

    cache.leaderboardCache.set(CACHE_KEY, playersLeaderboard);
    console.log("Leaderboard - Fetched from Riot API");
    return res.json(playersLeaderboard);
  } catch (error) {
    console.log(error);
    res.status(404).json({ error: "Error while getting match history" });
  }
});

module.exports = router;
