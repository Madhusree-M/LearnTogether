const express = require("express")
const {getAllQuestions, getQuestionById, createQuestion, addAnswer, toggleUpvote, updateQuestion, deleteQuestion} = require("../controllers/questionController")

const router = express.Router();

router.get("/", getAllQuestions);
router.get("/:question_id", getQuestionById);
router.post("/", createQuestion);
router.put("/:question_id", updateQuestion);
router.delete("/:question_id", deleteQuestion);
router.post("/:question_id/answer", addAnswer);
router.post("/:question_id/upvote", toggleUpvote);

module.exports = router;