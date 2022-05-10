const io = require('socket.io')({
    cors: {
        origin: ['http://localhost:3002']
    }
});

var rooms = []

io.on('connection', socket => {
console.log(`connect: ${socket.id}`);
socket.emit("message", rooms);

socket.on('hello!', (args) => {
    console.log(`hello from ${socket.id} ${args.room}`);
    if(io.sockets.adapter.rooms.get(args.room) != null && io.sockets.adapter.rooms.get(args.room).size < 2){
        socket.join(args.room);
        io.to(args.room).emit("message", {
            "player": 2,
            "startingPlayer": Math.floor(Math.random() * 2) + 1
        });
        console.log("joined room");
    }
    else{
        socket.disconnect();
        console.log("room full");
    }
});

socket.on('create!', (args) => {
    console.log(`hello from ${socket.id} ${args.room}`);
    if(io.sockets.adapter.rooms.get(args.room) == null){
        socket.join(args.room);
        rooms.push(args.room);
        io.to(args.room).emit("message", {
            "player": 1
        });
        console.log("created room");
    }
    else{
        socket.disconnect();
        console.log("room already created");
    }
});

socket.on('action!', (args) => {
    console.log(`hello from ${socket.id} ${socket.rooms}`);
    io.to(args.room).emit("message", {
        "cmd": args.cmd,
        "currentPlayer": args.player
    });
    console.log("ACTION!!!");
});

socket.on('end!', (args) => {
    console.log(`hello from ${socket.id} ${socket.rooms}`);
    io.to(args.room).emit("message", {
        "notNextPlayer": args.player
    });
    console.log("ACTION!!!");
});

socket.on('attack!', (args) => {
    console.log(`hello from ${socket.id} ${socket.rooms}`);
    io.to(args.room).emit("message", {
        "notYou": args.player,
        "attack": args.attack
    });
    console.log("ACTION!!!");
});

socket.on('swap!', (args) => {
    console.log(`hello from ${socket.id} ${socket.rooms}`);
    io.to(args.room).emit("message", {
        "notAgain": args.player,
        "newGrid": args.grid
    });
    console.log("ACTION!!!");
});

socket.onAny((event, ...args) => {
    console.log(event, args);
});

socket.on('disconnect', () => {
    console.log(`disconnect: ${socket.id}`);
});
});
  
io.listen(3001);