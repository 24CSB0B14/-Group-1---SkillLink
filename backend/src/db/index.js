import mongoose from "mongoose";

//connecting database through mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
    }
    catch (error) {
        console.error("❌ MongoDB connection error", error)
        process.exit(1)
    }
}

export default connectDB