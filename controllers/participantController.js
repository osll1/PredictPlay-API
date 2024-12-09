const Participant = require("../models/ParticipantModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const path = require("path");



exports.createParticipant = async (req, res) => {

    const participantData = {
        userName: req.body.userName,
        email: req.body.email, // קבלת אימייל מהבקשה
        password: req.body.password, // קבלת סיסמה מהבקשה
        role: req.body.role || "user", // קבלת תפקיד מהבקשה או הגדרת ברירת מחדל כ-"user"
        scorerImage: req.files["scorerImage"][0].path,
        winnerImage: req.files["winnerImage"][0].path,
        points: req.body.points || 0,
        predictions: req.body.predictions || [],
    };

    

    // יצירת אובייקט חדש של Participant עם המידע שנשלח
    const participant = new Participant(participantData);

    try {
        // שמירת המשתמש במסד הנתונים, הסיסמה תוצפן אוטומטית לפי ה-pre של הסכמה
        await participant.save();
        res.status(201).json(participant);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const participant = await Participant.findOne({ email });
        if (!participant) {
            return res.status(400).json({ success: false, message: "משתמש לא נמצא" });
        }

        const isMatch = await bcrypt.compare(password, participant.password);

        if (!isMatch) {
            console.log("אישור פרטים שגוי");
            return res.status(400).json({ success: false, message: "אימייל או סיסמה שגויים" });
        }

        const token = jwt.sign({ id: participant._id, role: participant.role, userName: participant.userName }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        res.json({ success: true, token });
    } catch (error) {
        console.error("שגיאה במהלך התחברות:", error.message);
        res.status(500).json({ success: false, message: "שגיאת שרת" });
    }
};


 exports.updateParticipantPoints = async (req, res) => {
    try {
        const participant = await Participant.findByIdAndUpdate(
            req.params.id,
            { points: req.body.points },
            { new: true }
        );
        res.status(200).json(participant);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

exports.getAllParticipants = async (req, res) => {
    try {
        const participants = await Participant.find().sort({ points: -1 });
        res.status(200).json(participants);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};




exports.updateParticipantImages = async (req, res) => {
    try {
        const { id } = req.params;

        // בדיקה אם הקבצים הועלו
        const scorerImage = req.files?.scorerImage?.[0]?.path || null;
        const winnerImage = req.files?.winnerImage?.[0]?.path || null;

        if (!scorerImage && !winnerImage) {
            return res.status(400).json({ message: "לא הועלו קבצים לעדכון" });
        }

       

        const updates = {};
        if (scorerImage) updates.scorerImage = path.normalize(scorerImage);
        if (winnerImage) updates.winnerImage = path.normalize(winnerImage);


        const updatedParticipant = await Participant.findByIdAndUpdate(
            id,
            updates,
            { new: true } // מחזיר את המסמך המעודכן
        );

        if (!updatedParticipant) {
            return res.status(404).json({ message: "משתמש לא נמצא" });
        }

        res.status(200).json({
            message: "תמונות עודכנו בהצלחה",
            updatedParticipant,
        });
    } catch (error) {
        console.error("שגיאה בעדכון התמונות:", error);
        res.status(500).json({ message: "שגיאת שרת", error: error.message });
    }
};





exports.updatePrediction = async (req, res) => {
  
    const { id } = req.params;
    const { gameId, homeScore, awayScore } = req.body;

    try {
        const participant = await Participant.findById(id);
        if (!participant) {
            
            return res.status(404).json({ message: "Participant not found" });
        }

        const existingPredictionIndex = participant.predictions.findIndex(
            (prediction) => prediction.gameId === gameId
        );

        if (existingPredictionIndex !== -1) {
            participant.predictions[existingPredictionIndex].homeScore = homeScore;
            participant.predictions[existingPredictionIndex].awayScore = awayScore;
        } else {
            participant.predictions.push({ gameId, homeScore, awayScore });
        }

        await participant.save();
        res.status(200).json(participant);
    } catch (error) {
        console.error("Error during prediction update:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.getParticipantById = async (req, res) => {
    try {
        const participant = await Participant.findById(req.params.id);
        if (!participant) {
            return res.status(404).json({ message: "Participant not found" });
        }
        res.status(200).json(participant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteParticipant = async (req, res) => {
    try {
      const { id } = req.params; // קבלת ID של המשתתף מהפרמטרים של הנתיב
  
      // מחיקת המשתתף מהמסד נתונים
      const deletedParticipant = await Participant.findByIdAndDelete(id);
  
      // בדיקה אם המשתתף לא נמצא
      if (!deletedParticipant) {
        return res.status(404).json({ message: 'משתתף לא נמצא' });
      }
  
      res.status(200).json({ message: 'משתתף נמחק בהצלחה' });
    } catch (error) {
      res.status(500).json({ message: 'שגיאה במחיקת המשתתף', error });
    }
  };




// פונקציית הרשמה
// exports.register = async (req, res) => {
//     const { userName, email, password } = req.body;
//     const scorerImage = req.files?.scorerImage?.[0]?.path;
//     const winnerImage = req.files?.winnerImage?.[0]?.path;

//     console.log("Received registration data:", { userName, email, password, scorerImage, winnerImage });

//     if (!userName || !email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }

//     try {
//         let user = await Participant.findOne({ email });
//         if (user) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         user = new Participant({
//             userName,
//             email,
//             password,
//             scorerImage:"",
//             winnerImage:"",
//             role: "user"
//         });

//         await user.save();

//         const payload = {
//             user: {
//                 id: user.id,
//                 role: user.role,
//             },
//         };

//         jwt.sign(
//             payload,
//             process.env.JWT_SECRET,
//             { expiresIn: "1h" },
//             (err, token) => {
//                 if (err) throw err;
//                 res.status(201).json({ token, user });
//             }
//         );
//     } catch (error) {
//         console.error("Error during registration:", error.message);
//         res.status(500).send("Server error");
//     }
// };



//שונה
exports.register = async (req, res) => {
    const { userName, email, password } = req.body;

    try {
        let user = await Participant.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        user = new Participant({
            userName,
            email,
            password,
            scorerImage: null, // כברירת מחדל
            winnerImage: null, // כברירת מחדל
            role: "user",
        });

        await user.save();

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
            (err, token) => {
                if (err) throw err;
                res.status(201).json({ token, user });
            }
        );
    } catch (error) {
        console.error("Error during registration:", error.message);
        res.status(500).send("Server error");
    }
};

