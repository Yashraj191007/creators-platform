import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const dbURI = process.env.NODE_ENV === 'test'
            ? process.env.MONGO_URI_TEST
            : (process.env.DATABASE_URL || process.env.MONGO_URI);

        const conn = await mongoose.connect(dbURI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
