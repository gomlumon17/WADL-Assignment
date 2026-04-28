const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const cors = require("cors");
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static("public")); // Serve frontend files

// Routes
app.use("/api/users", require("./routes/userRoutes"));

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Server
app.listen(3000, () => console.log("Server running on port 3000"));