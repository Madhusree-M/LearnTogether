const mongoose = require("mongoose")
const User = require("./User")
const answerSchema = new mongoose.Schema(
  {
    answer_id: {
      type: Number,
      required: true,
      unique: true
    },

    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model('answers', answerSchema)