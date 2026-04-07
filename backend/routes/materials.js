const express = require("express");
const {getAllMaterials, getMaterialById, createMaterial, toggleUpvote, updateMaterial, deleteMaterial} = require("../controllers/materialController");

const router = express.Router();

// GET all materials
router.get("/", getAllMaterials);

// GET single material
router.get("/:material_id", getMaterialById);

// POST upload material
router.post("/", createMaterial);

// UPDATE & DELETE material
router.put("/:material_id", updateMaterial);
router.delete("/:material_id", deleteMaterial);

// POST upvote / remove upvote
router.post("/:material_id/upvote", toggleUpvote);

module.exports = router;