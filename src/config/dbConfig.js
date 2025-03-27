const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        const dbURI = process.env.MONGO_URI; // Get from .env
        if (!dbURI) {
            throw new Error("MONGO_URI is not defined in .env file!");
        }

        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1); // Exit process if connection fails
    }
};

module.exports = connectDB;
