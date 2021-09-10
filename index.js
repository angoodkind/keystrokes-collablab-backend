const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 8080;

// let node; 
// let room = 0;
// let members = 1;


let count = 0;
let room = 0;
let nodes = {};
let rooms = {};
let roomMap = {};

app.get("", (req, res) => {
    console.log("connected");
    res.send("connected");
  });


http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

app.get("/reset", (req, res) => {
    count = 0;
    room = 0;
    nodes = {};
    rooms = {};
    roomMap = {};
    res.status(200).send("Reset");
})



io.on('connection', (socket) => { 
    socket.join(`room${room}`);
    socket.emit('connection', {room: room, count: count});
    roomMap[socket.id] = count;
    if (count == 0) {
        count = count + 1;
    } else {
        count = 0;
        room++;
    }
    console.log(`new client connected, and the socket id was ${socket.id}`);

    socket.on('message', (data) => {
        console.log(`Hello ${data.room}`)
        io.to(`room${data.room}`).emit("message", data.signal)
    })

    socket.on('setNode', (data) => {
        nodes[data.room] = data.signal;
        console.log("SET NODE EVENT");
        console.log(data.signal);
        io.to(`room${data.room}`).emit("setNode", data.signal)
    })

    socket.on('getNode', (data) => {
        console.log("GET NODE EVENT");
        console.log(nodes[data.room]);
        io.to(`room${data.room}`).emit("getNode", nodes[data.room]);
    })


});








