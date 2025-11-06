import express from 'express';
import process from 'node:process';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors'
import dotenv from 'dotenv'
import authenticate from './routes/auth-routes.js'
import cookieParser from 'cookie-parser';

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
  origin: ['http://localhost:5173'],
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

app.listen(PORT, () => {
  console.log(`App is listening to port ${PORT}`);
});
