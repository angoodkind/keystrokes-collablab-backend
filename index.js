var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

const PORT = 8080;
let count = 0;

// const app = express();
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

// let roomMap = {

// }


io.on('connection', (socket) => { 
    // socket.join(`room${room}`);
    // roomMap[socket.id] = `room${room}`;
    // console.log(roomMap[socket.id]);
    // if (members <= 1) {
    //     members += 1;
    // } else {
    //     members = 0;
    //     room++;
    // }


    console.log(`new client connected, and the socket id was ${socket.id}`);
    count++;
    socket.emit('connection', count);

    socket.on('disconnect', () => {
        count--;
    });

    socket.on('message', (data) => {
        io.sockets.emit("message", data)
    })

    socket.on('setNode', (data) => {
        node = data;
        io.sockets.emit("setNode", data)
    })

    socket.on('getNode', () => {
        io.sockets.emit("getNode", node);
    })

    // .to(roomMap[socket.id])

});








