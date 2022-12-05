import { OrderCreatedListener } from "../events/listeners/order-created-listener";
import { natsWrapper } from "./nats-wrapper"

const connectNATS = async () => {
  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID!, process.env.NATS_CLIENT_ID!, process.env.NATS_URL!);

    new OrderCreatedListener(natsWrapper.client).listen();
    
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