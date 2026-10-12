import mongoose from "mongoose";

export const connectToDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from your environment variables!");
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected successfully!");

    } catch (error) {
        console.log("Database connection error", error);
        process.exit(1);
    }

}

