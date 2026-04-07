const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema(
  {
    material_id: {
      type: Number,
      required: true,
      unique: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    file_url: {
      type: String,
      required: true
    },

    uploaded_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    uploader_name: {
      type: String,
      required: true
    },
    upvotes: {
      type: [String], // array of user_ids
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("materials", materialSchema);
