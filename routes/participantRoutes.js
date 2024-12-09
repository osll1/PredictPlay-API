


const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantController");
const multer = require("multer");
const authMiddleware = require("../middleware/adminMiddleware");
const {updateParticipantImages} = require("../controllers/participantController")

const {
    createParticipant,
    updateParticipantPoints,
    login,
    register,
    deleteParticipant,
    getAllParticipants,
    updatePrediction,
    getParticipantById,  // ודא שהפונקציה הזו קיימת ב-controller
} = require('../controllers/participantController');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });



router.post("/", [authMiddleware.isAdmin, upload.fields([{ name: "scorerImage" }, { name: "winnerImage" }])], participantController.createParticipant);
router.post("/login" , login);
router.post("/register" ,upload.fields([{ name: "scorerImage" }, { name: "winnerImage" }]), participantController.register)
router.put("/:id", updateParticipantPoints);
router.put(
    "/participants/:id",
    upload.fields([{ name: "scorerImage", maxCount: 3 }, { name: "winnerImage", maxCount: 3 }]),
    updateParticipantImages
);

router.get("/", getAllParticipants);
router.get("/:id", getParticipantById);  // תיקון הכפילות של "/participants"
router.put("/predictions/:id", updatePrediction);
router.delete("/:id" , deleteParticipant)



module.exports = router;




