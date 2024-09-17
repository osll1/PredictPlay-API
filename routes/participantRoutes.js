// const express = require("express");
// const router = express.Router();
// const participantController = require("../controllers/participantController");
// const multer = require("multer");

// const {
//     createParticipant,
//     updatePoints,
//     getAllParticipants,
//     addPrediction,
//   } = require('../controllers/participantController');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "uploads/");
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });

// const upload = multer({ storage: storage });

// router.post("/participants", upload.fields([{ name: "scorerImage" }, { name: "winnerImage" }]), participantController.createParticipant);
// router.put("/:id", participantController.updateParticipantPoints);
// router.get("/", participantController.getAllParticipants);
// router.put("/predictions/:id", participantController.updatePrediction);

// module.exports = router;





const express = require("express");
const router = express.Router();
const participantController = require("../controllers/participantController");
const multer = require("multer");
const authMiddleware = require("../middleware/adminMiddleware");

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
router.get("/", getAllParticipants);
router.get("/:id", getParticipantById);  // תיקון הכפילות של "/participants"
router.put("/predictions/:id", updatePrediction);
router.delete("/:id" , deleteParticipant)

module.exports = router;







// const express = require('express');
// const router = express.Router();
// const {
//   createParticipant,
//   updatePoints,
//   getParticipants,
//   addPrediction,
// } = require('../controllers/participantController');

// // יצירת משתתף חדש
// router.post('/add-user', createParticipant);

// // עדכון נקודות למשתתף
// router.put('/participants/:id', updatePoints);

// // החזרת כל המשתתפים
// router.get('/participants', getParticipants);

// // הוספת או עדכון ניחוש
// router.put('/predictions/:id', addPrediction);

// module.exports = router;
