// gameRoutes.js
const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });

router.post("/", upload.fields([{ name: "homeTeamImage" }, { name: "awayTeamImage" }]), gameController.createGame);
router.get("/", gameController.getAllGames);
router.put("/:id", gameController.updateGame);
router.get("/:id", gameController.getGameById); // וודא שהנתיב הזה לפני המחיקה
router.delete("/:id", gameController.deleteGame);

module.exports = router;


