const { v4: uuidv4 } = require("uuid");

const mapRankedInfo = (
  queueType,
  data = null,
  isLeaderboard = false,
  position = 0
) => {
  let tier = data?.tier ?? "Unranked";

  if (isLeaderboard) {
    tier = "CHALLENGER";
  }

  return {
    puuid: data?.puuid ?? "",
    position: position,
    leagueId: data?.leagueId ?? uuidv4(),
    queueType: queueType,
    tier: tier,
    rank: data?.rank ?? "",
    leaguePoints: data ? `${data?.leaguePoints} LP` : "N/A",
    wins: data ? `${data?.wins}W` : "N/A",
    losses: data ? `${data?.losses}L` : "N/A",
    winrate: data ? calculateWinrate(data.wins, data.losses) : "N/A",
  };
};

const calculateWinrate = (wins, losses) => {
  const sum = wins + losses;
  return `${Math.floor((wins / sum) * 100)}%`;
};

module.exports = mapRankedInfo;
