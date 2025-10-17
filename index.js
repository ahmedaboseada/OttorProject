import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import ticketsRouter from './routes/ticketsRouter.js';
import usersRouter from './routes/usersRouter.js';
import connectDB from './config/db.js';
import limiter from './config/rateLimiting.js';
import helmetConfig from './config/helmet.js';
import helmet from 'helmet';
import dotenv from 'dotenv';
dotenv.config({
    path: './config/.env'
});
connectDB();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: 'ottor-seven.vercel.app', // Frontend server URL
    credentials: true
}))
app.use(limiter)
app.use(helmet(helmetConfig))

app.use('/tickets', ticketsRouter);
app.use('/users', usersRouter);

app.use(`{/*dummy}`, (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

export default app;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
    