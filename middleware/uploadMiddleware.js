const multer = require("multer");
const path = require("path");

// הגדרת תיקיית היעד להעלאת קבצים
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("ניתן להעלות רק תמונות"));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;

