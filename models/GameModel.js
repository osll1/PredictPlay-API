

const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
  homeTeam: { type: String, required: true },
  homeTeamImage: { type: String, required: true },
  awayTeam: { type: String, required: true },
  awayTeamImage: { type: String, required: true },
  date: { type: Date, required: true }, // תאריך ושעה בפורמט ISO
  homeScore: { type: Number, default: 0 }, // תוצאה של קבוצת הבית
  awayScore: { type: Number, default: 0 }, // תוצאה של קבוצת החוץ
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;
