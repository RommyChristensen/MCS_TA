import { OrderCreatedListener } from "./events/listeners/order-created-listener";
import { OrderDoneListener } from "./events/listeners/order-done-listener";
import { natsWrapper } from "./nats-wrapper";
const start = async () => {
    // ENV VARIABLES
    console.log("Starting expiration service");

    if(!process.env.NATS_CLIENT_ID){
        throw new Error('NATS CLIENT ID must be defined');
    }

    if(!process.env.NATS_URL){
        throw new Error('NATS URL ID must be defined');
    }

    if(!process.env.NATS_CLUSTER_ID){
        throw new Error('NATS CLUSTER ID must be defined');
    }

    // END ENV VARIABLES
    // --------------------
    // NATS CLIENT & LISTENERS

    try{
        await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        });
    
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        // LISTENERS
        new OrderCreatedListener(natsWrapper.client).listen();
        new OrderDoneListener(natsWrapper.client).listen();

    }catch(err){
        console.log(err);
    }

    // END NATS CLIENT
    // --------------------
}

start();
// export default storage;