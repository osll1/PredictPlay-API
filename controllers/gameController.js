const Game = require("../models/GameModel");


exports.createGame = async (req, res) => {
    const newGame = new Game({
        homeTeam: req.body.homeTeam,
        homeTeamImage:
            req.files && req.files["homeTeamImage"]
                ? `/uploads/${req.files["homeTeamImage"][0].filename}`
                : req.body.homeTeamImage,
        awayTeam: req.body.awayTeam,
        awayTeamImage:
            req.files && req.files["awayTeamImage"]
                ? `/uploads/${req.files["awayTeamImage"][0].filename}`
                : req.body.awayTeamImage,
        time: req.body.time,
        date: req.body.date,
    });

    try {
        await newGame.save();
        res.status(201).json(newGame);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

exports.getAllGames = async (req, res) => {
    try {
        const games = await Game.find();
        res.status(200).json(games);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.getGameById = async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

exports.deleteGame = async (req, res) => {
    try {
      const { id } = req.params; // קבלת ה-ID של המשחק מהפרמטרים של הנתיב
  
      if (!id) {
        return res.status(400).json({ message: "Invalid game ID" });
      }
  
      const deletedGame = await Game.findByIdAndDelete(id); // שימוש ב-Mongoose למחיקת המשחק מהמסד נתונים
  
      if (!deletedGame) {
        return res.status(404).json({ message: "Game not found" });
      }
  
      res.status(200).json({ message: "Game deleted successfully" });
    } catch (error) {
      console.error("Error deleting game:", error.message);
      res.status(500).json({ message: "Failed to delete game", error: error.message });
    }
  };


exports.updateGame = async (req, res) => {
    const { id } = req.params;
    const { homeScore, awayScore } = req.body;
  
    try {
      const updatedGame = await Game.findByIdAndUpdate(
        id,
        { homeScore, awayScore },
        { new: true }
      );
      res.status(200).json(updatedGame);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
