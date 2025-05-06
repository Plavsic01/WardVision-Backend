const NodeCache = require("node-cache");

// Cache for n hours for champion rotation
const rotationCache = new NodeCache({ stdTTL: 3600 * 12 });
// Cache for n min for summoner info (puuid,summoner name, level, profileIcon )
const summonerCache = new NodeCache({ stdTTL: 300 });
// Cache for n min for match history
const matchHistoryCache = new NodeCache({ stdTTL: 300 });
// Cache for n min for specific match
const matchCache = new NodeCache({ stdTTL: 300 });
// Cache for n min for ranked stats
const rankedCache = new NodeCache({ stdTTL: 300 });

module.exports = {
  rotationCache,
  summonerCache,
  matchHistoryCache,
  matchCache,
  rankedCache,
};
