require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");
const Room = require("./models/Room");
const authRoutes = require("./routes/authRoutes");
const roomRoutes = require("./routes/roomRoutes");



connectDB();

const roomCode = {};
const roomLanguage = {};
const roomUsers = {};

const app = express();

app.use(
  cors({
    origin: [
      "https://collab-editor-client-t4o8.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/test", (req, res) => {
  res.send("Server Working");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "https://collab-editor-client-t4o8.vercel.app",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.currentRoom = null;

  //  JOIN ROOM
  socket.on("join_room",  async ({ room, username }) => {
    if (!room) return;

    console.log("JOIN:", room, username);

    socket.username = username;

    socket.join(room);
    socket.currentRoom = room;

    // create room if not exist
    if (!roomUsers[room]) {
      roomUsers[room] = [];
    }

    // add user (no duplicate)
    if (!roomUsers[room].some((user) => user.id === socket.id)) {
      roomUsers[room].push({
        id: socket.id,
        name: username || "Anonymous",
      });
    }

    //  SEND FULL USERS LIST
    io.to(room).emit("users_update", roomUsers[room]);

   //  DB se  data load 

   const roomData = await Room.findOne({ roomId: room });

if (roomData) {
  socket.emit("receive_message", roomData.code || "");
  socket.emit("language_change", roomData.language || "javascript");
}

});

 //  CODE SYNC
socket.on("send_message", async (data) => {
  if (!data?.room || typeof data.message !== "string") return;

  roomCode[data.room] = data.message;

  //  DB save
  await Room.findOneAndUpdate(
    { roomId: data.room },
    { code: data.message },
    { upsert: true }
  );

   socket.emit("saved");

  socket.to(data.room).emit("receive_message", data.message);
});
  //  LANGUAGE SYNC
  socket.on("language_change", (data) => {
    if (!data?.room) return;

    roomLanguage[data.room] = data.language;

    socket.to(data.room).emit("language_change", data.language);
  });


  //  send chat

socket.on("send_chat", ({ room, message }) => {
  if (!room || !message) return;

  const chatData = {
    user: socket.username || "Anonymous",
    message,
    time: new Date().toLocaleTimeString(),
  };

  io.to(room).emit("receive_chat", chatData);
});

  //  DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const room = socket.currentRoom;
    if (!room || !roomUsers[room]) return;

    // remove user
    roomUsers[room] = roomUsers[room].filter(
      (user) => user.id !== socket.id
    );

    // clean empty room
    if (roomUsers[room].length === 0) {
      delete roomUsers[room];
      delete roomCode[room];
      delete roomLanguage[room];
    } else {
      // SEND UPDATED USERS LIST
      io.to(room).emit("users_update", roomUsers[room]);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});