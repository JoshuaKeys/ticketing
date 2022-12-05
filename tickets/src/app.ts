import cookieSession from 'cookie-session';
import express from 'express';
import { currentUser, errorHandler } from '@giantsofttickets/common';
import { router } from './routes/tickets';


const app = express();
app.set('trust proxy', true)
app.use(express.json());
app.use(
    cookieSession({
        signed: false,
        secure: true
    })
);
app.use(currentUser)

if(!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
}
if(!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined')
}
if(!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
}
if(!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
}
if(!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
}

app.use('/api/tickets', router);

app.use(errorHandler)

export { app }