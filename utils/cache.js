const NodeCache = require("node-cache");

// Cache for 12 hours for champion rotation
const rotationCache = new NodeCache({ stdTTL: 3600 * 12 });
// Cache for 5 min for summoner info (puuid,summoner name, level, profileIcon )
const summonerCache = new NodeCache({ stdTTL: 300 });
// Cache for 5 min for match history
const matchHistoryCache = new NodeCache({ stdTTL: 300 });
// Cache for 5 min for specific match
const matchCache = new NodeCache({ stdTTL: 300 });
// Cache for 5 min for ranked stats
const rankedCache = new NodeCache({ stdTTL: 300 });
// Cache for 1/2 hour for leadearboard stats
const leaderboardCache = new NodeCache({ stdTTL: 1800 });

module.exports = {
  rotationCache,
  summonerCache,
  matchHistoryCache,
  matchCache,
  rankedCache,
  leaderboardCache,
};
