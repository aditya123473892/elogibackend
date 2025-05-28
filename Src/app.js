const express = require("express");
const path = require("path");
const cors = require("cors");
const { connectDB } = require("./config/dbconfig");

// Load environment variables
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const app = express();

// CORS configuration - place this before routes
app.use(
  cors({
    origin: ["http://localhost:3000", "https://your-production-frontend-domain.com"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require('./routes/AdminRoutes');
const transportRequestRoutes = require("./routes/transportRequestRoutes");
const transporterRoutes = require("./routes/transporterDetailsRoutes");

// Mount routes with more specific routes first
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/transport-requests", transportRequestRoutes);
app.use("/api", transporterRoutes); // Change this from "/api/transporter" to "/api"

// Add route not found handler
app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.status = 404;
  next(error);
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Close server & exit process
  process.exit(1);
});

module.exports = app;
