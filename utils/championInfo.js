const { v4: uuidv4 } = require("uuid");

const mapChampionsInfo = (champions) => {
  const championsData = Object.entries(champions).map(([name, champion]) =>
    mapChampionInfo(name, champion)
  );

  return championsData;
};

const mapChampionInfo = (name, champion) => {
  const championData = {
    id: champion.id,
    name: name,
    icon: champion.image.full,
    tag: champion.tags[0],
    difficulty: Math.round((champion.info.difficulty / 10) * 5),
  };
  return championData;
};

const mapChampionDetails = (champion) => {
  let typeOfMana = champion.partype;

  if (champion.partype === "Mana") {
    typeOfMana = "Mana";
  } else if (champion.partype === "Energy") {
    typeOfMana = "Energy";
  } else if (champion.partype === "None") {
    typeOfMana = "No Resource";
  }

  const championData = {
    id: champion.id,
    name: champion.name,
    tag: champion.tags[0],
    title: champion.title,
    difficulty: Math.round((champion.info.difficulty / 10) * 5),
    splashArt: `${champion.id}_${champion.skins[0].num}`,
    lore: champion.lore,
    stats: [
      {
        name: "Health",
        value: champion.stats.hp,
        perLvl: champion.stats.hpperlevel,
      },
      {
        name: typeOfMana,
        value: champion.stats.mp,
        perLvl: champion.stats.mpperlevel,
      },
      {
        name: "Armor",
        value: champion.stats.armor,
        perLvl: champion.stats.armorperlevel,
      },
      {
        name: "Magic Resist",
        value: champion.stats.spellblock,
        perLvl: champion.stats.spellblockperlevel,
      },
      {
        name: "Attack Speed",
        value: champion.stats.attackspeed,
        perLvl: champion.stats.attackspeedperlevel,
      },
      {
        name: "Attack Damage",
        value: champion.stats.attackdamage,
        perLvl: champion.stats.attackdamageperlevel,
      },
      {
        name: "Attack Range",
        value: champion.stats.attackrange,
        perLvl: "",
      },
      {
        name: "Move Speed",
        value: champion.stats.movespeed,
        perLvl: "",
      },
    ],

    spells: [
      {
        id: uuidv4(),
        type: "Passive",
        name: champion.passive.name,
        description: champion.passive.description,
        icon: champion.passive.image.full,
      },
      {
        id: uuidv4(),
        type: "Q",
        name: champion.spells[0].name,
        description: champion.spells[0].description,
        cooldown: champion.spells[0].cooldownBurn,
        cost: champion.spells[0].costBurn,
        icon: champion.spells[0].image.full,
      },
      {
        id: uuidv4(),
        type: "W",
        name: champion.spells[1].name,
        description: champion.spells[1].description,
        cooldown: champion.spells[1].cooldownBurn,
        cost: champion.spells[1].costBurn,
        icon: champion.spells[1].image.full,
      },
      {
        id: uuidv4(),
        type: "E",
        name: champion.spells[2].name,
        description: champion.spells[2].description,
        cooldown: champion.spells[2].cooldownBurn,
        cost: champion.spells[2].costBurn,
        icon: champion.spells[2].image.full,
      },
      {
        id: uuidv4(),
        type: "R",
        name: champion.spells[3].name,
        description: champion.spells[3].description,
        cooldown: champion.spells[3].cooldownBurn,
        cost: champion.spells[3].costBurn,
        icon: champion.spells[3].image.full,
      },
    ],
  };

  return championData;
};

module.exports = {
  mapChampionsInfo,
  mapChampionDetails,
};
