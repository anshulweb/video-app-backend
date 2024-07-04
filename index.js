import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import usersRoute from '../server/routes/usersRoute.js';
import videoRoute from '../server/routes/videosRoute.js';
import commentRoute from '../server/routes/commentRoute.js';
import authRoute from '../server/routes/authRoute.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
//Configure dotenv

dotenv.config();

const connect = () => {
  mongoose
    .connect(process.env.MONGO_BASE_URL)
    .then(() => {
      console.log('Connected to database');
    })
    .catch((err) => {
      throw err;
    });
};
const app = express();
//Routes
app.use(
  cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use('/api/users', usersRoute);
app.use('/api/videos', videoRoute);
app.use('/api/comments', commentRoute);
app.use('/api/auth', authRoute);
app.get('/', (req, res) => {
  res.send({
    messages: 'Welcome to backend',
  });
});
//Server started
app.listen(8800, () => {
  connect();
  console.log(`Connected on http://localhost:8800`);
});
