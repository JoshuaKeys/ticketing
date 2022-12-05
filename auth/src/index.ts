

import { app } from './app'
import { connectDb } from './db/connect-db';

connectDb();


app.listen(3000, () =>{
    console.log('Listening on 3000!')
});