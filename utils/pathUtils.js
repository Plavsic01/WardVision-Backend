const fs = require("fs-extra");
const path = require("path");

async function getCurrentVersion() {
  // GET "version.txt" file
  const LOCAL_VERSION_FILE = path.join(__dirname, "../ddragon/version.txt");
  // READ "version.txt" file
  const currentVersion = await fs.readFile(LOCAL_VERSION_FILE, "utf-8");
  return currentVersion;
}

async function findJSON(filePath) {
  // GET path to champion.json file
  const currentVersion = await getCurrentVersion();

  const CHAMPION_JSON = path.join(
    __dirname,
    `../ddragon/${currentVersion}/${filePath}`
  );
  return CHAMPION_JSON;
}

module.exports = { findJSON, getCurrentVersion };
