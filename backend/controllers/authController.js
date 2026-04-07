const User = require("../models/User")
const Question = require("../models/Question");
const Material = require("../models/Material");
const Answer = require("../models/Answer");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const getUsers = async (req, res) => {
  const users = await User.find();
  if (users) {
    res.status(200).json(users);
  }
  else {
    res.status(404).json({ error: "User Not Found" })
  }
}

const getUserById = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findOne({ user_id: Number(user_id) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const registerUser = async (req, res) => {
  try {

    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "User already exists!" })
      return;
    }

    // bcrypt.hash(password,10) => hash function applied 2^10 times

    const hashedPassword = await bcrypt.hash(password, 10);

    const lastUser = await User.findOne().sort({ user_id: -1 });

    const user = await User.create(
      {
        user_id: lastUser ? lastUser.user_id + 1 : 1,
        email, password: hashedPassword,
        name
      });

    res.status(201).json({ message: "User created successfully", user })
  }
  catch (err) {
    res.status(400).json({ error: err.message })
  }
}


const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email })

    if (!user) {
      res.status(404).json({ error: "User not found" })
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect) {
      res.status(404).json({ error: "Invalid password" })
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRES_IN }

    )
    res.status(200).json({ message: "Login successful", token, user })
  }
  catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// controllers/userController.js


const getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;

    const questionsCount = await Question.countDocuments({ author: userId });
    const materialsCount = await Material.countDocuments({ uploaded_by: userId });

    // Count answers from the Answer collection
    const answersCount = await Answer.countDocuments({ author: userId });

    res.json({
      questions: questionsCount,
      materials: materialsCount,
      answers: answersCount
    });
  } catch (err) {
    console.error("getUserStats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserActivity = async (req, res) => {
  try {
    const userId = req.params.id;

    const questions = await Question.find({ author: userId }).sort({ createdAt: -1 }).limit(5);
    const materials = await Material.find({ uploaded_by: userId }).sort({ createdAt: -1 }).limit(5);
    const answers = await Answer.find({ author: userId })
      .populate("question", "title")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      questions,
      materials,
      answers
    });
  } catch (err) {
    console.error("getUserActivity error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().select('user_id name email');
    console.log("Found users count:", users.length);
    const leaderboard = await Promise.all(
      users.map(async (user) => {
        try {
          const questionsCount = await Question.countDocuments({ author: user._id });
          const materialsCount = await Material.countDocuments({ uploaded_by: user._id });

          // Count answers from the Answer collection
          const answersCount = await Answer.countDocuments({ author: user._id });

          const totalContributions = questionsCount + materialsCount + answersCount;

          return {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            questions: questionsCount,
            materials: materialsCount,
            answers: answersCount,
            totalContributions
          };
        } catch (innerErr) {
          console.error(`Failed to calculate stats for user ${user.email}:`, innerErr);
          // Return valid object with 0 stats or null to filter out
          return {
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            questions: 0,
            materials: 0,
            answers: 0,
            totalContributions: 0,
            error: true
          };
        }
      })
    );
    // Sort by total contributions
    leaderboard.sort((a, b) => b.totalContributions - a.totalContributions);

    // Assign badges to top 3
    const leaderboardWithBadges = leaderboard.map((user, index) => {
      let badge = null;
      if (index === 0) badge = { name: "Master Contributor", color: "gold" };
      else if (index === 1) badge = { name: "Pro Contributor", color: "silver" };
      else if (index === 2) badge = { name: "Active Learner", color: "bronze" };

      return { ...user, badge, rank: index + 1 };
    });

    res.json(leaderboardWithBadges);
  } catch (err) {
    console.error("getLeaderboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { mongoId } = req.params;

    // 1️⃣ User Info
    const user = await User.findById(mongoId).select("name email role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 2️⃣ Stats & Rank Calculation
    const [questionsCount, materialsCount, answersCount, allUsers] = await Promise.all([
      Question.countDocuments({ author: mongoId }),
      Material.countDocuments({ uploaded_by: mongoId }),
      Answer.countDocuments({ author: mongoId }),
      User.find().select('_id')
    ]);

    const totalContributions = questionsCount + materialsCount + answersCount;

    // To get rank, we need to compare with others (this is a bit heavy but okay for small scale)
    // A better way would be a pre-calculated field or a more optimized query.
    const allStats = await Promise.all(allUsers.map(async (u) => {
      const q = await Question.countDocuments({ author: u._id });
      const m = await Material.countDocuments({ uploaded_by: u._id });
      const a = await Answer.countDocuments({ author: u._id });
      return { id: u._id.toString(), points: q + m + a };
    }));

    allStats.sort((a, b) => b.points - a.points);
    const rank = allStats.findIndex(s => s.id === mongoId) + 1;

    // 3️⃣ Recent Activity
    const [questions, materials, answers] = await Promise.all([
      Question.find({ author: mongoId }).sort({ createdAt: -1 }).limit(5),
      Material.find({ uploaded_by: mongoId }).sort({ createdAt: -1 }).limit(5),
      Answer.find({ author: mongoId })
        .populate("question", "title")
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.status(200).json({
      user,
      stats: {
        questions: questionsCount,
        materials: materialsCount,
        answers: answersCount,
        totalPoints: totalContributions,
        rank: rank
      },
      activity: {
        questions,
        materials,
        answers
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getUserProfile, registerUser, getUsers, getUserById, loginUser, getUserStats, getUserActivity, getLeaderboard }