const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect("mongodb://localhost:27017/LearnTogether");
        console.log("MongoDB connected successfully!")
    }
    catch(err)
    {
        console.error("MongoDB connection error",err.message);
        process.exit(1);
    }
}

module.exports = connectDB;