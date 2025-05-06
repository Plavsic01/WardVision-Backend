const express = require("express");
const router = express.Router();
const riot = require("../services/riotAPI");
const cache = require("../utils/cache");
const getRegion = require("../utils/region");

router.get("/:region/:gameName/:tagLine", async (req, res) => {
  try {
    const { region, gameName, tagLine } = req.params;

    const CACHE_KEY = `${region}${gameName}${tagLine}_summonerInfo`;

    const cachedData = cache.summonerCache.get(CACHE_KEY);

    if (cachedData) {
      console.log("Serving from summoner cache");
      return res.json(cachedData);
    }

    const accountInfo = await riot.getAccountByGameNameAndTag(
      getRegion(region),
      gameName,
      tagLine
    );

    const summonerInfo = await riot.getSummonerInfo(region, accountInfo.puuid);

    const summonerData = {
      ...summonerInfo,
      gameName: accountInfo.gameName,
      tagLine: accountInfo.tagLine,
    };

    cache.summonerCache.set(CACHE_KEY, summonerData);
    console.log("Summoner Fetched from Riot API");
    res.json(summonerData);
  } catch (error) {
    res
      .status(error.status)
      .json({ error: "Error while getting summoner details" });
  }
});

module.exports = router;
