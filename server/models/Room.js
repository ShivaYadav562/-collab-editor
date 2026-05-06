const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: String,
  code: String,
  language: String,
});

module.exports = mongoose.model("Room", roomSchema);