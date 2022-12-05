

import { app } from './app'
import { connectDb } from './db/connect-db';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { connectNATS } from './nats/connect';
import { natsWrapper } from './nats/nats-wrapper';

connectNATS();

connectDb();


app.listen(3000, () =>{
    console.log('Listening on 3000!')
});