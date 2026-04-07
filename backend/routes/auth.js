const express = require("express")
const { getUserProfile, registerUser, getUsers, getUserById, loginUser, getUserStats, getUserActivity, getLeaderboard } = require("../controllers/authController");

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.post("/register", registerUser);
router.get("/:user_id", getUserById);
router.get("/", getUsers)
router.post("/login", loginUser)
router.get("/:id/stats", getUserStats);
router.get("/:id/activity", getUserActivity);
router.get("/:mongoId/profile", getUserProfile);

module.exports = router;