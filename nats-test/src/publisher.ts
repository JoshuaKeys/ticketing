import nats from 'node-nats-streaming';
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear()


const stan = nats.connect('ticketing', 'abc', {
  url: `https://localhost:4222`
});

stan.on('connect', async () => {
  console.log('Publisher connected to nats');

  const publisher = new TicketCreatedPublisher(stan);
  await publisher.publish({
    id: '123',
    title: 'concert',
    price: 20
  })

})