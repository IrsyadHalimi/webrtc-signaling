const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
// const { Server } = require("./socket");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", socket => {
    console.log('User connected: ', socket.id);

    socket.on("join", room => {
        socket.join(room);
        socket.to(room).emit("user-joined", socket.id);
    });

    socket.on("offer", ({ room, offer }) => {
        socket.to(room).emit("offer", offer);
    });

    socket.on("answer", ({ room, answer }) => {
        socket.to(room).emit("answer", answer);
    });

    socket.on("ice-candidate", ({ room, candidate }) => {
        socket.to(room).emit("ice-candidate", candidate);
    });

    socket.on("disconnect", () => {
        console.log('User disconnected: ', socket.id);
    });
});

server.listen(3000, () => {
    console.log('Signaling server running on http://localhost:3000');
});