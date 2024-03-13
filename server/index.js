const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { Server } = require("socket.io");

const port = process.env.PORT;

app.use(cors());

app.use(express.json());

const server = app.listen(port, () => {
  console.log(`App started at port ${port}`);
});

app.get("/", (req, res) => {
  res.send({ success: true, data: "Server Online" });
});

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

//Route
let roomGlobal, curr;
io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;

    socket.join(data?.roomId);
    socket.emit("userIsJoined", data.roomId, { success: true });
    console.log("userIsJoined in room: ", data.roomId);
  });

  let room, name;
  socket.on("newData", (data) => {
    // console.log(data.roomId);
    room = data.roomId;
    name = data.name;
    io.to(room).emit("test", {
      name: data.name,
      pic: data.pic,
    });
    // console.log("Emitted newDataReceived event to room:", data.roomId);
  });
});
