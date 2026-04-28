const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUsers,
  updateUser,
  deleteUser
} = require("../controllers/userController");

// CRUD APIs
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;