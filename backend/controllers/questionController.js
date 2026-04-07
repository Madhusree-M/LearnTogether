const Question = require("../models/Question");

// GET all questions ✅
const getAllQuestions = async (req, res) => {
  try {
    const { query, sort, subject } = req.query;
    let filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } }
      ];
    }

    if (subject) {
      filter.subject = subject;
    }

    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo"
        }
      },
      { $unwind: "$authorInfo" },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "question",
          as: "replies"
        }
      },
      {
        $addFields: {
          upvoteCount: { $size: { $ifNull: ["$upvotes", []] } },
          answerCount: { $size: "$replies" },
          author_name: "$authorInfo.name"
        }
      },
      {
        $project: { replies: 0, authorInfo: 0 }
      }
    ];

    if (sort === "popular") {
      pipeline.push({ $sort: { upvoteCount: -1, createdAt: -1 } });
    } else {
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    const questions = await Question.aggregate(pipeline);

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch questions", error: error.message });
  }
};

// GET single question by question_id ✅
const getQuestionById = async (req, res) => {
  try {
    const { question_id } = req.params;

    const questionArr = await Question.aggregate([
      { $match: { question_id: Number(question_id) } },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "authorInfo"
        }
      },
      { $unwind: "$authorInfo" },
      {
        $lookup: {
          from: "answers",
          localField: "_id",
          foreignField: "question",
          as: "replies"
        }
      },
      {
        $addFields: {
          answerCount: { $size: "$replies" },
          author_name: "$authorInfo.name"
        }
      },
      { $project: { replies: 0, authorInfo: 0 } }
    ]);

    const question = questionArr[0];

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch question", error: error.message });
  }
};

// POST create a new question ✅
const createQuestion = async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      author
    } = req.body;

    const lastQuestion = await Question.findOne().sort({ question_id: -1 });

    const question = new Question({
      question_id: lastQuestion ? lastQuestion.question_id + 1 : 1,
      title,
      description,
      subject,
      author
    });

    await question.save();

    res.status(201).json({
      message: "Question created successfully",
      question
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST add answer to a question
const addAnswer = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { author_name, text } = req.body;

    const question = await Question.findOne({ question_id: Number(question_id) });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    
    // answers are in a separate collection, the code here seems to expect an array on question
    // but the schema doesn't have it. I should use the Answer model.
    res.status(400).json({ message: "Use the /answers route to add answers" });

  } catch (error) {
    res.status(500).json({ message: "Failed to add answer" });
  }
};

// POST upvote / remove upvote
const toggleUpvote = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const question = await Question.findOne({ question_id: Number(question_id) });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    const index = question.upvotes.findIndex(id => id === user_id);

    if (index === -1) {
      question.upvotes.push(user_id);
    } else {
      question.upvotes.splice(index, 1);
    }

    await question.save();

    res.status(200).json({
      message: "Upvote updated",
      upvotes: question.upvotes.length
    });
  } catch (error) {
    console.error("Upvote Error:", error);
    res.status(500).json({ message: "Failed to update upvote", error: error.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { title, description, subject, userId } = req.body;

    const question = await Question.findOne({ question_id: Number(question_id) });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this question" });
    }

    question.title = title || question.title;
    question.description = description || question.description;
    question.subject = subject || question.subject;

    await question.save();
    res.status(200).json({ message: "Question updated successfully", question });
  } catch (error) {
    res.status(500).json({ message: "Failed to update question", error: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const { question_id } = req.params;
    const { userId } = req.body;

    const question = await Question.findOne({ question_id: Number(question_id) });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    if (question.author.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this question" });
    }

    await Question.deleteOne({ _id: question._id });

    // Also delete associated answers
    const Answer = require("../models/Answer");
    await Answer.deleteMany({ question: question._id });

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete question", error: error.message });
  }
};

module.exports = { getAllQuestions, getQuestionById, createQuestion, addAnswer, toggleUpvote, updateQuestion, deleteQuestion };