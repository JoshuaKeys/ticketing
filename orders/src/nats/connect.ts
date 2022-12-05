import { ExpirationCompleteListener } from "../events/listeners/expiration-complete-listener";
import { PaymentCreatedListener } from "../events/listeners/payment-created-listener";
import { TicketCreatedListener } from "../events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "../events/listeners/ticket-updated-listener";
import { natsWrapper } from "./nats-wrapper"

const connectNATS = async () => {
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);
    console.log('Orders Connected to Nats')

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompleteListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();
    
    natsWrapper.client.on('close', () => {
      console.log('NATS connection close');
      process.exit();
    })

    process.on('SIGINT', () => {
      natsWrapper.client.close();
    });
    process.on('SIGTERM', () => {
      natsWrapper.client.close();
    });
    
  } catch (err) {
    console.error(err);
  }
}

export { connectNATS }