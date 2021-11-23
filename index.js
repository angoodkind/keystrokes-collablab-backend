// Load the necessary libraries. This server code is hosted on Heroku at 
// keystrokes-collablab.herokuapp.com.
// When running on ec2, no need to worry about Heroku

const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
// const PORT = process.env.PORT || 8080;
const PORT = 8080;

let count = 0;
let room = 0;
let nodes = {};
let rooms = {};
let roomMap = {};


// Going to https://keystrokes-collablab.herokuapp.com. will show "connected"
// Or localhost:8080 on the EC2 instance

app.get("", (req, res) => {
    console.log("connected");
    res.send("connected");
  });

http.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});


// This was more for testing purposes.
// Going to https://keystrokes-collablab.herokuapp.com/reset will reset the room count.
// (localhost:8080/reset for EC2)
// Meaning the next client to login after a reset will start as subject 0, room 0,
// and the client after that is subject 1, room 0, and then subject 0 room 1, etc.
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
    // this is still updating every time a new subj joins
    socket.emit('connection', {room: room, count: count});
    
    // Use a dictionary to keep track of how many people are in what room
    // when 2nd subject joins (count=1), emit a message to App.js that will advance
    // the prompt
    roomMap[socket.id] = count;
    if (count == 0) {
        count = count + 1;
    } else {
        // const d = new Date();  
        // const expDate = d.toLocaleDateString().replace(/\//g,'-'); // replace all /'s with -'s
        // const expTime = d.toLocaleTimeString('en-GB'); //24-hour time format
        // const expNode = expDate+`_`+expTime;
        io.to(`room${room}`).emit('readyForTimer', {room: room, count: count});
        count = 0;
        room++;
    }
    console.log(`new client connected, and the socket id was ${socket.id}`);

    // Use the soclket.io library to send messages to the right rooms.
    socket.on('message', (data) => {
        console.log(`Hello ${data.room}`)
        io.to(`room${data.room}`).emit("message", data.signal)
    })

    // Use the socket.io library to tell clients what room they're in.
    socket.on('setNode', (data) => {
        nodes[data.room] = data.signal;
        console.log("SET NODE EVENT");
        console.log(data.signal);
        io.to(`room${data.room}`).emit("setNode", data.room)
    })

    socket.on('getNode', (data) => {
        console.log("GET NODE EVENT");
        console.log(nodes[data.room]);
        io.to(`room${data.room}`).emit("getNode", data.room);
    })

    socket.on('disconnect', () => {
        console.log('count: ',count,'room: ',room)
        console.log('disconnect');
        if (count == 1) {
            count = 0;
            room++;
        }

    })


});








