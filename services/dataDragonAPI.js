const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const pathUtils = require("../utils/pathUtils");

const LOCAL_VERSION_FILE = path.join(__dirname, "../ddragon/version.txt");

async function getLatestVersion() {
  const res = await axios.get(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );

  return res.data[0];
}

async function downloadFile(url, outputPath) {
  const res = await axios.get(url, { responseType: "stream" });
  await fs.ensureDir(path.dirname(outputPath));
  return new Promise((resolve, reject) => {
    const stream = res.data.pipe(fs.createWriteStream(outputPath));
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

// FETCH CHAMPION JSON FILE
async function fetchChampionJSON(dataPath, version) {
  const championData = (await axios.get(`${dataPath}/champion.json`)).data.data;
  await fs.outputJson(`ddragon/${version}/champions.json`, championData, {
    spaces: 2,
  });
  return championData;
}

// FETCH SUMMONER SPELLS JSON FILE
async function fetchSummonerSpellsJSON(dataPath, version) {
  const summonerSpellsData = (await axios.get(`${dataPath}/summoner.json`)).data
    .data;
  await fs.outputJson(
    `ddragon/${version}/summonerSpells.json`,
    summonerSpellsData,
    {
      spaces: 2,
    }
  );
  return summonerSpellsData;
}

// FETCH ITEM JSON FILE
async function fetchItemJSON(dataPath, version) {
  const itemData = (await axios.get(`${dataPath}/item.json`)).data.data;
  await fs.outputJson(`ddragon/${version}/items.json`, itemData, { spaces: 2 });
  return itemData;
}

// FETCH CHAMPION DETAILS
async function fetchChampionDetails(championData, version, dataPath) {
  const champDir = `ddragon/${version}/champions`;

  const champions = Object.keys(championData).map((champion) =>
    downloadFile(
      `${dataPath}/champion/${champion}.json`,
      `${champDir}/${champion}.json`
    )
  );
  await Promise.all(champions);
}

// FETCH CHAMPION ICONS
async function fetchChampionIcons(championData, version, base) {
  const champIconDir = `ddragon/${version}/img/champions`;
  await fs.ensureDir(champIconDir);
  const champIcons = Object.keys(championData).map((name) =>
    downloadFile(
      `${base}/img/champion/${name}.png`,
      `${champIconDir}/${name}.png`
    )
  );
  await Promise.all(champIcons);
}

// FETCH ITEM ICONS
async function fetchItemIcons(itemData, version, base) {
  const itemIconDir = `ddragon/${version}/img/items`;
  await fs.ensureDir(itemIconDir);
  const itemIcons = Object.keys(itemData).map((id) =>
    downloadFile(`${base}/img/item/${id}.png`, `${itemIconDir}/${id}.png`)
  );
  await Promise.all(itemIcons);
}

// FETCH SUMMONER SPELL ICONS
async function fetchSummonerSpellIcons(summonerSpellData, version, base) {
  const summonerSpellIconDir = `ddragon/${version}/img/summonerSpells`;
  await fs.ensureDir(summonerSpellIconDir);
  const summonerSpellIcons = Object.keys(summonerSpellData).map((id) =>
    downloadFile(
      `${base}/img/spell/${id}.png`,
      `${summonerSpellIconDir}/${id}.png`
    )
  );
  await Promise.all(summonerSpellIcons);
}

// FETCH SPELLS
async function fetchSpells(championData, version, base) {
  const spellDir = `ddragon/${version}/img/spells`;
  await fs.ensureDir(spellDir);

  const passiveDir = `ddragon/${version}/img/passive`;
  await fs.ensureDir(passiveDir);

  const championSpells = Object.keys(championData).map((champion) =>
    pathUtils.findJSON(`champions/${champion}.json`)
  );

  const championsPath = await Promise.all(championSpells);

  const championsPromise = championsPath.map((path) => fs.readJSON(path));

  const championsData = await Promise.all(championsPromise);

  const championNames = Object.keys(championData);

  const spellsForAllChampions = championNames.map(
    (champName, indx) => championsData[indx]["data"][champName]["spells"]
  );

  const passiveIds = championNames.map(
    (champName, indx) =>
      championsData[indx]["data"][champName]["passive"]["image"]["full"]
  );

  const spellIds = spellsForAllChampions.map((champSpells) => {
    return champSpells.map((spell) => spell.id);
  });

  const champSpellsIcons = spellIds
    .flat()
    .map((spellId) =>
      downloadFile(
        `${base}/img/spell/${spellId}.png`,
        `${spellDir}/${spellId}.png`
      )
    );

  await Promise.all(champSpellsIcons);

  const champPassiveIcons = passiveIds.map((passiveId) =>
    downloadFile(
      `${base}/img/passive/${passiveId}`,
      `${passiveDir}/${passiveId}`
    )
  );

  await Promise.all(champPassiveIcons);
}

async function fetchAndSave(version) {
  const base = `https://ddragon.leagueoflegends.com/cdn/${version}`;
  const dataPath = `${base}/data/en_US`;

  console.log(`⬇️  Downloading data for version ${version}...`);

  // 1. Save version
  await fs.outputFile(LOCAL_VERSION_FILE, version);

  // 2. Download champion.json
  const championData = await fetchChampionJSON(dataPath, version);

  // 3. Download details about specific champion /champion/Aatrox.json
  await fetchChampionDetails(championData, version, dataPath);

  // 4. Download spell icons about specific chmapion
  await fetchSpells(championData, version, base);

  // 5. Download item.json
  const itemData = await fetchItemJSON(dataPath, version);

  // 6. Download champion icons
  await fetchChampionIcons(championData, version, base);

  // 7. Download item icons
  await fetchItemIcons(itemData, version, base);

  // 8. Download summoner spells JSON
  const summonerSpellsData = await fetchSummonerSpellsJSON(dataPath, version);

  // 9. Download summoner spell icons
  await fetchSummonerSpellIcons(summonerSpellsData, version, base);

  console.log("✅ DDragon data downloaded and saved.");
}

async function main() {
  try {
    const latest = await getLatestVersion();

    let currentVersion = "";
    if (fs.existsSync(LOCAL_VERSION_FILE)) {
      currentVersion = await fs.readFile(LOCAL_VERSION_FILE, "utf-8");
    }

    if (currentVersion !== latest) {
      console.log(`🔁 Updating from ${currentVersion || "none"} to ${latest}`);
      await fetchAndSave(latest);
    } else {
      console.log(`✅ Version ${latest} already up to date.`);
    }
  } catch (err) {
    console.error("❌ Error updating DDragon:", err.message);
  }
}

main();
