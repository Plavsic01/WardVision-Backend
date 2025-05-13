const { v4: uuidv4 } = require("uuid");

const mapMatchInfo = (data, currSummPuuid) => {
  const matchDetails = {
    id: uuidv4(),
    platformId: data.info.platformId,
    gameType: formatTypeOfGame(data.info.queueId),
    gameDuration: calculateGameLength(data.info.gameDuration),
    // gameCreation: timeAgo(data.info.gameCreation),
    gameCreation: timeAgo(data.info.gameEndTimestamp),
    currentSummoner: findCurrentSummoner(data.info.participants, currSummPuuid),
    teams: mapPlayersToTeams(data.info.participants),
  };
  return matchDetails;
};

const calculateGameLength = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
};

function timeAgo(timestampMs) {
  const now = Date.now();
  const diffMs = now - timestampMs;

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years >= 1) return years === 1 ? "1 year ago" : `${years} years ago`;
  if (months >= 1) return months === 1 ? "1 month ago" : `${months} months ago`;
  if (weeks >= 1) return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  if (days >= 1) return days === 1 ? "1 day ago" : `${days} days ago`;
  if (hours >= 1) return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
  if (minutes >= 1)
    return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
  return "just now";
}

const formatTypeOfGame = (queueId) => {
  let typeOfGame = null;

  switch (queueId) {
    case 400:
    case 490:
      typeOfGame = "Normal";
      break;
    case 420:
      typeOfGame = "Ranked Solo/Duo";
      break;
    case 440:
      typeOfGame = "Ranked Flex";
      break;
    case 450:
      typeOfGame = "ARAM";
      break;
    case 1700:
      typeOfGame = "Arena";
      break;
    case 900:
      typeOfGame = "URF";
      break;
    default:
      typeOfGame = "N/A";
  }

  return typeOfGame;
};

const findCurrentSummoner = (players, currPuuid) => {
  return mapPlayerDetails(
    players.filter((player) => player.puuid === currPuuid)
  )[0];
};

const mapPlayersToTeams = (participants) => {
  const players = mapPlayerDetails(participants);

  if (players.length === 10) {
    const mid = Math.floor(players.length / 2);
    const teams = [players.slice(0, mid), players.slice(mid)];
    return teams;
  } else if (players.length === 16) {
    const sortedPlayers = players.sort((a, b) => a.placement - b.placement);
    const teams = [];
    for (let i = 0; i < sortedPlayers.length; i += 2) {
      teams.push([sortedPlayers[i], sortedPlayers[i + 1]]);
    }
    return teams;
  }
};

const mapPlayerDetails = (players) => {
  const playerDetails = players.map((player) => {
    const totalCreepScore =
      player.totalMinionsKilled + player.neutralMinionsKilled;

    return {
      totalDamage: player.totalDamageDealtToChampions.toLocaleString(),
      wards: player.wardsPlaced,
      gameName: player.riotIdGameName,
      tagLine: player.riotIdTagline,
      puuid: player.puuid,
      championName:
        player.championName !== "FiddleSticks"
          ? player.championName
          : "Fiddlesticks",
      items: [
        { id: uuidv4(), itemId: player.item0 },
        { id: uuidv4(), itemId: player.item1 },
        { id: uuidv4(), itemId: player.item2 },
        { id: uuidv4(), itemId: player.item3 },
        { id: uuidv4(), itemId: player.item4 },
        { id: uuidv4(), itemId: player.item5 },
        { id: uuidv4(), itemId: player.item6 },
      ],
      summonerD: player.summoner1Id,
      summonerF: player.summoner2Id,
      kills: player.kills,
      assists: player.assists,
      deaths: player.deaths,
      kda:
        player.challenges?.kda.toFixed(2) ??
        (
          (player.kills + player.assists) /
          (player.deaths === 0 ? 1 : player.deaths)
        ).toFixed(2),
      role: player.teamPosition,
      creepScore: totalCreepScore,
      gold: player.goldEarned,
      placement: player.placement,
      win: player.win,
      side: player.teamId === 100 ? "Blue Team" : "Red Team",
      teamId: player.teamId,
    };
  });

  return playerDetails;
};

module.exports = mapMatchInfo;
