const express = require ("express")
const {getAnswers, addAnswer, updateAnswer, deleteAnswer} = require("../controllers/answerController");
const authMiddleware = require("../middlewares/authMiddleware")
const router = express.Router();

router.get("/:questionId",authMiddleware ,getAnswers)
router.post("/:questionId",authMiddleware,addAnswer)
router.put("/:answer_id", authMiddleware, updateAnswer)
router.delete("/:answer_id", authMiddleware, deleteAnswer)

module.exports = router;