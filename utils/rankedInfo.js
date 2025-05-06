const { v4: uuidv4 } = require("uuid");

const mapRankedInfo = (queueType, data = null) => {
  return {
    leagueId: data?.leagueId ?? uuidv4(),
    queueType: queueType,
    tier: data?.tier ?? "Unranked",
    rank: data?.rank ?? "",
    leaguePoints: data ? `${data?.leaguePoints} LP` : "N/A",
    wins: data ? `${data?.wins} W` : "N/A",
    losses: data ? `${data?.losses} L` : "N/A",
    winrate: data ? calculateWinrate(data.wins, data.losses) : "N/A",
  };
};

const calculateWinrate = (wins, losses) => {
  const sum = wins + losses;
  return `${Math.floor((wins / sum) * 100)}%`;
};

module.exports = mapRankedInfo;
