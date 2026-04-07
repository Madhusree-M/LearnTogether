const Material = require("../models/Material");

// GET all materials
const getAllMaterials = async (req, res) => {
  try {
    const { query, sort, subject } = req.query;
    let filter = {};

    if (query) {
      filter.title = { $regex: query, $options: "i" };
    }

    if (subject) {
      filter.subject = subject;
    }

    let materials;
    if (sort === "popular") {
      materials = await Material.aggregate([
        { $match: filter },
        { $addFields: { upvoteCount: { $size: "$upvotes" } } },
        { $sort: { upvoteCount: -1, createdAt: -1 } }
      ]);
    } else {
      materials = await Material.find(filter).sort({ createdAt: -1 });
    }

    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch materials", error: error.message });
  }
};

// GET material by material_id
const getMaterialById = async (req, res) => {
  try {
    const { material_id } = req.params;

    const material = await Material.findOne({
      material_id: Number(material_id)
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch material" });
  }
};

// POST create material
const createMaterial = async (req, res) => {
  try {
    const {
      title,
      subject,
      file_url,
      uploaded_by,
      uploader_name
    } = req.body;

    const lastMaterial = await Material.findOne().sort({ material_id: -1 });

    const material = await Material.create({
      material_id: lastMaterial ? lastMaterial.material_id + 1 : 1,
      title,
      subject,
      file_url,
      uploaded_by,
      uploader_name
    });

    await material.save();

    res.status(201).json({
      message: "Material uploaded successfully",
      material
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to upload material" });
  }
};

// POST upvote / remove upvote
const toggleUpvote = async (req, res) => {
  try {
    const { material_id } = req.params;
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const material = await Material.findOne({
      material_id: Number(material_id)
    });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    const index = material.upvotes.findIndex(id => id === user_id);

    if (index === -1) {
      material.upvotes.push(user_id);
    } else {
      material.upvotes.splice(index, 1);
    }

    await material.save();

    res.status(200).json({
      message: "Upvote updated",
      upvotes: material.upvotes.length
    });
  } catch (error) {
    console.error("Upvote Error:", error);
    res.status(500).json({ message: "Failed to update upvote", error: error.message });
  }
};

const updateMaterial = async (req, res) => {
  try {
    const { material_id } = req.params;
    const { title, subject, file_url, userId } = req.body;

    const material = await Material.findOne({ material_id: Number(material_id) });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (material.uploaded_by.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this material" });
    }

    material.title = title || material.title;
    material.subject = subject || material.subject;
    material.file_url = file_url || material.file_url;

    await material.save();
    res.status(200).json({ message: "Material updated successfully", material });
  } catch (error) {
    res.status(500).json({ message: "Failed to update material", error: error.message });
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const { material_id } = req.params;
    const { userId } = req.body;

    const material = await Material.findOne({ material_id: Number(material_id) });

    if (!material) {
      return res.status(404).json({ message: "Material not found" });
    }

    if (material.uploaded_by.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to delete this material" });
    }

    await Material.deleteOne({ _id: material._id });
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete material", error: error.message });
  }
};

module.exports = { getAllMaterials, getMaterialById, createMaterial, toggleUpvote, updateMaterial, deleteMaterial };
