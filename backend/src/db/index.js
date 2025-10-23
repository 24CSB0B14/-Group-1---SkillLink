import mongoose from "mongoose"

//connecting database through mongoose
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ MongoDB connected")
        console.log("../backend/src/db/index.js")
    }
    catch (error) {
        console.error("❌ MongoDB connection error", error)
        console.log("../backend/src/db/index.js")
        process.exit(1)
    }
}

export default connectDB