const mongoose = require("mongoose");

const leagueSchema = new mongoose.Schema({
  leagueName: {
    type: String,
    required: true,
    trim: true,
  },
  participants: {
    type: [String], // רשימה של שמות המשתתפים
    required: true,
    validate: [arrayLimit, "יש להוסיף לפחות שני משתתפים"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, // מזהה של יוצר הליגה
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length >= 2; // דרישה של לפחות שני משתתפים
}

module.exports = mongoose.model("League", leagueSchema);
