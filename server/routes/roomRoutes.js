const express = require("express");
const Room = require("../models/Room");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/create", (req, res) => {
  res.send("CREATE ROUTE FOUND");
});

// CREATE ROOM
router.post("/create", authMiddleware, async (req, res) => {

  console.log("ROOM API HIT");
  console.log("BODY:", req.body);

  try {

    const {
      roomId,
      roomName,
      owner,
    } = req.body;

    const room = await Room.create({
      roomId,
      roomName,
      owner,
    });

    console.log("ROOM SAVED:", room);

    res.status(201).json(room);

  } catch (error) {

    console.log("ROOM ERROR:", error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});

router.get("/test", (req, res) => {
  res.send("ROOM ROUTE WORKING");
});

module.exports = router;