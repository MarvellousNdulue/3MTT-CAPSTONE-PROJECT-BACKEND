const mongoose = require("mongoose");

console.log("DB URI:", process.env.DB_URI);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
