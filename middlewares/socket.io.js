const socketIO = require('socket.io') 
const dotenv= require('dotenv')

dotenv.config()


function intializeSocket(server) {
    const io = socketIO(server, {
        pingTimeout:60000,
        cors: {
            origin:["https://ecovibe.netlify.app"]
         },
      });
      

    io.on('connection', (socket) => {
        socket.on('setup', (id) => {
            socket.join(id)
            socket.emit('connected')
            console.log('A user connected' +id);
        });

        socket.on('join', (room) => {
            socket.join(room);
            console.log("joined");
        })

        socket.on('chatMessage', (message) => {
           
            if (message) {
              console.log("seding ...");
           
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