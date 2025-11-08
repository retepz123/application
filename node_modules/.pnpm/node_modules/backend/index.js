import express from 'express';
import process from 'node:process';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import authenticate from './routes/auth-routes.js'
import cookieParser from 'cookie-parser';
import messageRoute from './routes/message-routes.js'
import { Server } from 'socket.io';
import http from 'http';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

async function connectDB() {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('✅ Connected Succesfully');
  } catch (err) {
    console.error('❌ Unable to connect');
  }
}
connectDB();

app.use(cors({
  origin: ['http://localhost:5173', 'https://from-hi-to-forever.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));


app.set('port', PORT);
app.use(express.json());
app.use(bodyParser.json()),
app.use(cookieParser());



app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello World!',
  });
});

app.use('/api/auth', authenticate );
app.use('/api/messages', messageRoute);

// create http server and socket io server
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
   origin: ['http://localhost:5173', 'https://from-hi-to-forever.onrender.com'],
   credentials: true,
  },
});

//handle socket with connections
io.on('connection', (socket) => {
  console.log('User connected', socket.id);

  //user sends message
  socket.on('sendmessage', (data) => {
    console.log('Message received:', data);
    //message to receiver
    io.to(data.receiverId).emit('receive message:', data);
  });

  // joing a user room
  socket.on('join Room:', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});




app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
