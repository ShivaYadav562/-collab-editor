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

//  CORS 

const allowedOrigins = [
  "https://collab-editor-client.vercel.app", // Production
  "https://collab-editor-client-t4o8.vercel.app", // Preview
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

//  Routes 

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/test", (req, res) => {
  res.send("Server Working");
});

// HTTP Server 

const server = http.createServer(app);

// Socket.IO 

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.currentRoom = null;

  // JOIN ROOM
  socket.on("join_room", async ({ room, username }) => {
    if (!room) return;

    console.log("JOIN:", room, username);

    socket.username = username;

    socket.join(room);
    socket.currentRoom = room;

    if (!roomUsers[room]) {
      roomUsers[room] = [];
    }

    if (!roomUsers[room].some((user) => user.id === socket.id)) {
      roomUsers[room].push({
        id: socket.id,
        name: username || "Anonymous",
      });
    }

    io.to(room).emit("users_update", roomUsers[room]);

    const roomData = await Room.findOne({ roomId: room });

    if (roomData) {
      socket.emit("receive_message", roomData.code || "");
      socket.emit(
        "language_change",
        roomData.language || "javascript"
      );
    }
  });

  // CODE SYNC
  socket.on("send_message", async (data) => {
    if (!data?.room || typeof data.message !== "string") return;

    roomCode[data.room] = data.message;

    await Room.findOneAndUpdate(
      { roomId: data.room },
      { code: data.message },
      { upsert: true }
    );

    socket.emit("saved");

    socket.to(data.room).emit("receive_message", data.message);
  });

  
  // LANGUAGE SYNC
socket.on("language_change", async (data) => {
  if (!data?.room) return;

  roomLanguage[data.room] = data.language;

 
  await Room.findOneAndUpdate(
    { roomId: data.room },
    {
      language: data.language,
    },
    { upsert: true }
  );

  socket.to(data.room).emit(
    "language_change",
    data.language
  );
});

  // CHAT
  socket.on("send_chat", ({ room, message }) => {
    if (!room || !message) return;

    const chatData = {
      user: socket.username || "Anonymous",
      message,
      time: new Date().toLocaleTimeString(),
    };

    io.to(room).emit("receive_chat", chatData);
  });

  // DISCONNECT
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    const room = socket.currentRoom;

    if (!room || !roomUsers[room]) return;

    roomUsers[room] = roomUsers[room].filter(
      (user) => user.id !== socket.id
    );

    if (roomUsers[room].length === 0) {
      delete roomUsers[room];
      delete roomCode[room];
      delete roomLanguage[room];
    } else {
      io.to(room).emit("users_update", roomUsers[room]);
    }
  });
});

// Start Server 

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});