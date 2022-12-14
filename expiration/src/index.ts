
import { connectNATS } from './nats/connect';

connectNATS();


if(!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID must be defined')
}
if(!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID must be defined')
}
if(!process.env.NATS_URL) {
    throw new Error('NATS_URL must be defined')
}