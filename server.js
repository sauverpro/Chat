const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const cors = require("cors");
const formatMessage = require("./public/utils/messages");
// const dbConfig = require("./public/config/db.config.js");

// const { Sequelize, DataTypes } = require("sequelize");

const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./public/utils/users");

const PORT = 3000 || process.env.PORT;
const app = express();
var corsOption = {
  origin: `https://localhost:${PORT}`,
};
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(cors(corsOption));
app.use(express.static(path.join(__dirname, "public")));

// connect to database

// // end

// run when a client connects
io.on("connection", async (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    console.log(user);
    socket.join(user.room);

  
    //  welcome a current user
    socket.emit("message", formatMessage("sauveur", "welcome to ChatCord"));

    //  broadcast when a user conects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage("sauveur", `${user.username} has joined the chat`)
      );

    // Send users and room
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  // Listen for ChatMessage
  socket.on("message", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // run when a user disconnect

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage("sauveur", `${user.username} has left the chat`)
      );
      // Send users and room
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(PORT, () =>
  console.log(`the server is running an port : http://localhost:${PORT}`)
);
