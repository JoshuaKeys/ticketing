import { connect } from "mongoose";;

const connectDb = async () => {
    try {
        const conn = await connect(process.env.MONGO_URI!)
        console.log('Connected to Orders Database')
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

export { connectDb };