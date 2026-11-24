require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const Message = require("./models/Message");

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow any local origin or tools without origin
      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

const httpserver = http.createServer(app);

const io = new Server(httpserver, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Helper: Deterministic DM Room ID
function getDMRoomId(userOne, userTwo) {
  if (!userOne || !userTwo) return "";
  const u1 = userOne.trim().toLowerCase();
  const u2 = userTwo.trim().toLowerCase();
  const sorted = [u1, u2].sort();
  return `dm:${sorted[0]}:${sorted[1]}`;
}

// User Presence Mapping: normalized username -> Set of socket IDs
const onlineUsersMap = new Map(); // normalizedUsername -> { displayUsername: string, sockets: Set<string> }

// REST endpoint: Search users for DM
app.get("/api/users/search", (req, res) => {
  try {
    const query = (req.query.q || "").trim().toLowerCase();
    const current = (req.query.currentUser || "").trim().toLowerCase();

    const results = [];
    for (const [normUser, data] of onlineUsersMap.entries()) {
      if (normUser === current) continue; // Exclude current user
      if (!query || normUser.includes(query)) {
        results.push({
          username: data.displayUsername,
          normalized: normUser,
          isOnline: data.sockets.size > 0,
        });
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to search users" });
  }
});

// REST endpoint to load chat history for a selected group or DM
app.get("/api/messages/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const currentUser = (req.query.currentUser || "").trim().toLowerCase();

    // If it's a DM room, ensure the requesting user is one of the participants
    if (roomId.startsWith("dm:")) {
      const parts = roomId.split(":");
      if (parts.length === 3 && currentUser) {
        const u1 = parts[1];
        const u2 = parts[2];
        if (currentUser !== u1 && currentUser !== u2) {
          return res.status(403).json({ error: "Unauthorized to view this conversation" });
        }
      }
    }

    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

function getOnlineUsernamesList() {
  const list = [];
  for (const [, data] of onlineUsersMap.entries()) {
    if (data.sockets.size > 0) {
      list.push(data.displayUsername);
    }
  }
  return list;
}

let count = 0;

io.on("connection", (socket) => {
  count++;
  console.log("Active socket connections:", count);

  // Welcome & announcement
  socket.emit("gyaankibaat", "welcome to socket.io server");
  socket.emit("announcement", "Connected to ConnectX real-time server");

  socket.on("kuchbhi", (data) => {
    console.log("Received 'kuchbhi':", data);
  });

  // User Registration with multi-tab support & case-insensitivity
  socket.on("register_user", (rawUsername) => {
    if (!rawUsername || typeof rawUsername !== "string") return;
    const trimmed = rawUsername.trim();
    if (!trimmed) return;

    const norm = trimmed.toLowerCase();
    socket.username = trimmed;
    socket.normalizedUsername = norm;

    if (!onlineUsersMap.has(norm)) {
      onlineUsersMap.set(norm, {
        displayUsername: trimmed,
        sockets: new Set([socket.id]),
      });
    } else {
      const userData = onlineUsersMap.get(norm);
      userData.displayUsername = trimmed; // Keep latest display casing
      userData.sockets.add(socket.id);
    }

    io.emit("online_users", getOnlineUsernamesList());
    socket.broadcast.emit("join", `${trimmed} joined`);
  });

  // Search users via Socket event (alternative to REST)
  socket.on("search_users", (query) => {
    const q = (query || "").trim().toLowerCase();
    const current = socket.normalizedUsername;
    const results = [];
    for (const [normUser, data] of onlineUsersMap.entries()) {
      if (normUser === current) continue;
      if (!q || normUser.includes(q)) {
        results.push({
          username: data.displayUsername,
          normalized: normUser,
          isOnline: data.sockets.size > 0,
        });
      }
    }
    socket.emit("search_users_result", results);
  });

  // Join generic/group room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
  });

  // Join a direct message conversation
  socket.on("join_dm", ({ currentUser, otherUser }) => {
    if (!currentUser || !otherUser) return;
    const u1 = (currentUser || "").trim();
    const u2 = (otherUser || "").trim();
    if (!u1 || !u2) return;

    const roomId = getDMRoomId(u1, u2);
    socket.join(roomId);
    console.log(`${u1} joined ${roomId}`);
  });

  // Send a direct message
  socket.on("send_dm", async (data) => {
    try {
      const { sender, receiver, message, text, file, time } = data;
      const content = (message || text || "").trim();

      if (!content && !file) {
        return; // Validate not empty
      }

      if (!sender || !receiver) return;

      const normSender = sender.trim().toLowerCase();
      const normReceiver = receiver.trim().toLowerCase();

      // Verify that the sender socket is registered as sender
      if (socket.normalizedUsername && socket.normalizedUsername !== normSender) {
        return console.warn(`Unauthorized send_dm attempt from ${socket.normalizedUsername} claiming to be ${normSender}`);
      }

      const roomId = data.roomId || getDMRoomId(sender, receiver);
      const currentTime =
        time ||
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

      // Save to MongoDB before broadcasting
      const hasFile = file && (file.name || file.url);
      const saved = await Message.create({
        roomId,
        sender,
        receiver,
        type: "direct",
        text: content,
        message: content,
        file: hasFile ? file : undefined,
        time: currentTime,
      });

      const payload = {
        _id: saved._id,
        messageId: saved._id,
        sender: saved.sender,
        receiver: saved.receiver,
        message: saved.text,
        text: saved.text,
        file: hasFile ? file : null,
        time: saved.time,
        roomId: saved.roomId,
        type: "direct",
        createdAt: saved.createdAt,
      };

      io.to(roomId).emit("receive_dm", payload);
    } catch (err) {
      console.error("send_dm error:", err);
    }
  });

  // Send generic/group message
  socket.on("send_message", async (payload) => {
    try {
      const content = (payload.text || payload.message || "").trim();
      if (!content && !payload.file) return;

      const hasFile = payload.file && (payload.file.name || payload.file.url);
      const saved = await Message.create({
        roomId: payload.roomId,
        sender: payload.sender,
        type: "group",
        text: content,
        message: content,
        file: hasFile ? payload.file : undefined,
        time: payload.time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      });

      const broadcastMsg = saved.toObject();
      if (!hasFile) {
        delete broadcastMsg.file;
      }
      io.to(payload.roomId).emit("receive_message", broadcastMsg);
    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  // Typing indicators
  socket.on("typing", ({ roomId, username }) => {
    socket.to(roomId).emit("user_typing", { roomId, username });
  });

  socket.on("stop_typing", ({ roomId, username }) => {
    socket.to(roomId).emit("user_stop_typing", { roomId, username });
  });

  // Disconnect handling
  socket.on("disconnect", () => {
    count--;
    console.log("Active socket connections:", count);

    const norm = socket.normalizedUsername;
    if (norm && onlineUsersMap.has(norm)) {
      const userData = onlineUsersMap.get(norm);
      userData.sockets.delete(socket.id);

      // Only mark as offline if no active connections remain for this user
      if (userData.sockets.size === 0) {
        onlineUsersMap.delete(norm);
      }
      io.emit("online_users", getOnlineUsernamesList());
    }
  });
});

const PORT = process.env.PORT || 5000;
httpserver.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
