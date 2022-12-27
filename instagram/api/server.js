
import express from 'express';
import colors from 'colors';
import dotenv from 'dotenv';
import studentRoute from './routes/student.js';
import userRoute from './routes/user.js';
import mongoDBConnection from './config/db.js';
import erroHandeler from './middlewares/errorHandeler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


// init express
const app = express();
dotenv.config();


//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// init env variables
const PORT = process.env.SERVER_PORT || 5000;

//routes
app.use('/api/student', studentRoute);
app.use('/api/user', userRoute);

//express error Hnadeler
app.use(erroHandeler);

// listen server
app.listen(PORT, () => {

    mongoDBConnection()
    console.log(`Server running on port ${PORT}`.bgGreen.black);
});