const socketIO = require('socket.io') 
const dotenv= require('dotenv')

dotenv.config()


function intializeSocket(server) {
    const io = socketIO(server, {
        pingTimeout:60000,
        cors: {
            origin:["http://localhost:4200"]
         },
      });
      

    io.on('connection', (socket) => {
        socket.on('setup', (id) => {
            socket.join(id)
            socket.emit('connected')
            console.log('A user connected');
        });

        socket.on('join', (room) => {
            socket.join(room);
            console.log("joined");
        })

        socket.on('chatMessage', (message) => {
           
            if (message) {
              console.log(message);
                socket.in(message.toId).emit("message recieved", message);

            }else{
                console.log(message.fromId)
                socket.in(message.toId).emit("message recieved", message);
            }
        });

        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });

}



module.exports = intializeSocket