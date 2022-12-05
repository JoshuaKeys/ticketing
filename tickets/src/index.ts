

import { app } from './app'
import { connectDb } from '../db/connect-db';
import { connectNATS } from '../nats/connect';

connectNATS();

connectDb();


app.listen(3000, () =>{
    console.log('Listening on 3000!')
});