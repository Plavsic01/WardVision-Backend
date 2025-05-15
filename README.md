# 🧠 WardVision Backend

WardVision Backend is a robust Node.js & Express.js API that serves as the data core for the [WardVision Frontend](https://github.com/Plavsic01/WardVision). It communicates with Riot Games APIs and manages local data caching and patch version syncing, ensuring reliable and fast delivery of League of Legends game data.

---

## 🚀 Key Features

- 🔍 **Summoner Search** – Fetch summoner profile, ranked stats, and game status
- 🕹️ **Match History** – Retrieve recent matches with per-player and match-level details
- 🧙 **Champion Data** – Serve all champion info, stats, spells, images, and tooltips
- 🔄 **Champion Rotation** – Display the weekly free-to-play champion pool
- 🏆 **Leaderboard Access** – Get top player data by region and ranked queue type
- ⚡ **Caching Layer** – Reduce Riot API requests with in-memory caching
- 🧩 **Patch Syncing** – Update DataDragon data via script
- 🧪 **Clean API Structure** – Organized route/service layers
- 🔐 **Environment Safe** – Uses `.env` for sensitive config and API keys

---

## 🛠️ Tech Stack

- **Node.js** & **Express.js**
- **Axios** – For Riot API requests
- **PM2** – Process management and auto-restarts
- **Oracle Cloud VM** – Production hosting
- **Riot Games API** – Live League of Legends data
- **Riot DDragon** – Static asset repository (champion data, images, etc.)

---

## 🔁 Riot DDragon Integration

WardVision integrates Riot’s **Data Dragon (DDragon)** for champion icons, item images, abilities, and patch versions.

### 🔄 Auto Update Script

You can run this script manually or schedule it with a cron job:

```bash
npm run update:ddragon
```

What it does:

- Checks Riot’s latest version from the CDN

- Downloads new champion and asset data

- Updates ddragon/version.txt

## 🛠️ Setup & Run Locally

1. **Clone the repository**

```bash
git clone https://github.com/Plavsic01/WardVision-Backend
cd wardvision-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Create .env file**

```bash
PORT=4000
RIOT_API_KEY=your_riot_api_key
```

4. **Download DDragon data**

```bash
npm run update:ddragon
```

4. **Start the server**

```bash
npm run dev
```
