import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const server = createServer(app);
app.use(cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true
}));

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173', // Change from 3000 to 5174
        methods: ['GET', 'POST'],
        credentials: true
    }
});


const port= 3000;



app.get('/', (req, res)=>{
    res.send('Hello World');
});



io.on('connection', (socket)=>{
    console.log('a user connected', socket.id);
    

    socket.on("message", (data)=>{
        console.log(data.message);
        socket.to(data.room).emit("receive-message", data);
    });

    socket.on('join-room', (data)=>{
        
        socket.join(data.roomName);
        console.log(`User joined ${data.roomName}`);
    });

    socket.on('disconnect', ()=>{
        console.log('user disconnected',socket.id);
    });


    });



server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});

