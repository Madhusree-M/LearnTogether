const Answer = require("../models/Answer");

const addAnswer = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    const { text } = req.body;

    const newAnswer = new Answer({
      answer_id: Date.now(),
      question: questionId,
      author: req.userData.id,
      text
    });

    await newAnswer.save();

    res.status(201).json({
      message: "Answer added successfully",
      answer: newAnswer
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAnswers = async (req, res) => {
  try {
    const { questionId } = req.params;

    const answers = await Answer.find({ question: questionId })
      .populate("author")
      .sort({ createdAt: -1 });

    res.status(200).json({ answers });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAnswer = async (req, res) => {
  try {
    const { answer_id } = req.params;
    const { text, userId } = req.body;

    const answer = await Answer.findOne({ answer_id: Number(answer_id) });

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this answer" });
    }

    answer.text = text || answer.text;

    await answer.save();
    res.status(200).json({ message: "Answer updated successfully", answer });
  } catch (error) {
    res.status(500).json({ message: "Failed to update answer", error: error.message });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const { answer_id } = req.params;
    const { userId } = req.body;

    const answer = await Answer.findOne({ answer_id: Number(answer_id) });

    if (!answer) {
      return res.status(404).json({ message: "Answer not found" });
    }

    if (answer.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this answer" });
    }

    await Answer.deleteOne({ _id: answer._id });
    res.status(200).json({ message: "Answer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete answer", error: error.message });
  }
};

module.exports = { getAnswers, addAnswer, updateAnswer, deleteAnswer };