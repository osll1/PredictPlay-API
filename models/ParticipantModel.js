

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const participantSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  scorerImage: { type: String, required: true },
  winnerImage: { type: String, required: true },
  points: { type: Number, default: 0 },
  predictions: [
    {
      gameId: String,
      homeScore: Number,
      awayScore: Number,
    },
  ],
});

// הצפנת הסיסמה לפני שמירה
participantSchema.pre("save", async function (next) {
  if (this.isModified("password") && this.password) {
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    
    } catch (err) {
      console.error("Error during password hashing:", err);
      return next(err);
    }
  }
  next();
});


const Participant = mongoose.model("Participant", participantSchema);

module.exports = Participant;
