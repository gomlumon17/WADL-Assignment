const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  role: { type: String, required: true },
  github: { type: String, required: true },
  password: { type: String, required: true }
}, { 
  timestamps: true // Automatically adds createdAt and updatedAt dates
});

module.exports = mongoose.model("User", userSchema);