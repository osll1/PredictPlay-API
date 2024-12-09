

const dotenv = require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const participantRoutes = require("./routes/participantRoutes");
const gameRoutes = require("./routes/gameRoutes");

const CONNECTION_URL = process.env.CONNECTION_URL;
const app = express();
const PORT = process.env.PORT || 5000;

 

app.use(cors({
    origin: "http://localhost:3000", // או ה-URL של הלקוח
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"], // הוסף את x-auth-token
}));


app.use(bodyParser.json());
app.use("/uploads", cors() , express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/participants", participantRoutes);
app.use("/games", gameRoutes);
app.use("/api/users", participantRoutes);
app.use('/api', participantRoutes);


// חיבור ל-MongoDB
mongoose
    .connect(CONNECTION_URL, {})
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Connection error", error.message));

// הפעלת השרת
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
