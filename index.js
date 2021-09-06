var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const PORT = 8080;


app.get("/", (req, res) => {
    console.log("connected");
    res.send("connected");
  });

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

let node; 
// let room = 0;
// let members = 1;


let count = 0;
let room = 0;
let nodes = {};
let rooms = {};
let roomMap = {};



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








