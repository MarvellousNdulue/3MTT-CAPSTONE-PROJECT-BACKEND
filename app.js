// Import dependencies
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const connectDB = require("./utils/mongo");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// Environment variables and configuration
const PORT = process.env.PORT || 3000; // Fallback to 3000 if undefined
const DB_URI = process.env.DB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate required environment variables
if (!DB_URI || !JWT_SECRET) {
    console.error("DB_URI or JWT_SECRET is not defined in the .env file.");
    process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware setup

// Updated CORS configuration
const corsOptions = {
    origin: "https://3-mtt-capstone-project-frontend.vercel.app", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
    credentials: true, // Allow credentials (e.g., cookies)
};
app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(bodyParser.json());

// Static file serving
app.use(express.static(path.join(__dirname, "public")));

// JWT middleware for authentication
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
    if (!token) {
        return res.status(403).json({ error: "No token provided" });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        req.user = decoded; // Store decoded info in req.user
        next(); // Move to the next middleware or route handler
    });
};

// API routes
app.use("/auth", authRoutes); // Authentication routes (login & register)
app.use("/tasks", verifyToken, taskRoutes); // Protected task routes

// Root route handler
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Database connection
console.log('Connecting to database...');
connectDB();

// Start the server (if not in test environment)
if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Debug: log configuration
console.log("Server Configurations:");
console.log("PORT:", PORT);
console.log("DB_URI:", DB_URI);
console.log("JWT_SECRET:", JWT_SECRET);

// Export the app instance for testing
module.exports = app;
