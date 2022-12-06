import cookieSession from 'cookie-session';
import express from 'express';
import { errorHandler } from '@giantsofttickets/common';
import { authRouter } from './routes/auth';


const app = express();
app.set('trust proxy', true)
app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: false
    })
);
app.use('/api/users/', authRouter);
if(!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
}
if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
}


// Error handlers
app.use(errorHandler)

export { app }