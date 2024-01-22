import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config()


const connectDb = async (): Promise<void> => {
    try {
        await mongoose.connect(process.env.DATEBASE_URL as string)
    } catch (err) {
        console.log(err)
    }
}
export default connectDb