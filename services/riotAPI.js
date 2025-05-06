const axios = require("axios");
const apiKey = process.env.RIOT_API_KEY;

const header = {
  "Content-Type": "application/json",
  "X-Riot-Token": apiKey,
};

const baseURL = (region) => `https://${region}.api.riotgames.com`;

https: module.exports = {
  // Getting last 20 matches
  getMatchHistory: (region, puuid, start, count) => {
    return axios
      .get(
        `${baseURL(
          region
        )}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`,
        { headers: header }
      )
      .then((r) => r.data);
  },
  getMatch: (region, matchId) => {
    return axios
      .get(`${baseURL(region)}/lol/match/v5/matches/${matchId}`, {
        headers: header,
      })
      .then((r) => r.data);
  },
  // Getting summoner puuid
  getAccountByGameNameAndTag: (region, gameName, tagLine) => {
    return axios
      .get(
        `${baseURL(
          region
        )}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
        { headers: header }
      )
      .then((r) => r.data);
  },
  // Getting summoner info (level, icon)
  getSummonerInfo: (region, puuid) => {
    return axios
      .get(`${baseURL(region)}/lol/summoner/v4/summoners/by-puuid/${puuid}`, {
        headers: header,
      })
      .then((r) => r.data);
  },

  // Getting champion rotation (every week changes)
  getChampionRotation: (region) => {
    return axios
      .get(`${baseURL(region)}/lol/platform/v3/champion-rotations`, {
        headers: header,
      })
      .then((r) => r.data);
  },
  // Getting ranked info
  getRankedStats: (region, puuid) => {
    return axios
      .get(`${baseURL(region)}/lol/league/v4/entries/by-puuid/${puuid}`, {
        headers: header,
      })
      .then((r) => r.data);
  },
};
