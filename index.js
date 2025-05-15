require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const rotation = require("./routes/championRotation");
const summoner = require("./routes/summoner");
const leaderboard = require("./routes/leaderboard");
const ranked = require("./routes/ranked");
const matchHistory = require("./routes/matchHistory");
const champions = require("./routes/champions");
const items = require("./routes/items");
const spells = require("./routes/spells");

app.use("/api/rotation", rotation);
app.use("/api/summoner", summoner);
app.use("/api/leaderboard", leaderboard);
app.use("/api/ranked", ranked);
app.use("/api/match-history", matchHistory);
app.use("/api/champions", champions);
app.use("/api/items", items);
app.use("/api/spells", spells);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
