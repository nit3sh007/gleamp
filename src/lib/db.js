// import mongoose from 'mongoose';

// export const connectDB = async () => {
//   try {
//     const dbURI = process.env.MONGO_URI;
//     if (!dbURI) {
//       throw new Error("MONGO_URI is not defined in .env");
//     }
//     await mongoose.connect(dbURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       socketTimeoutMS: 60000, // Increase socket timeout to 60 seconds
//       serverSelectionTimeoutMS: 30000, // Increase server selection timeout to 30 seconds
//     });
//     console.log("✅ MongoDB Connected");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error);
//     process.exit(1);
//   }
// };
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    // Replace with your actual Atlas connection string
    const dbURI = process.env.MONGO_URI;
    
    if (!dbURI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      socketTimeoutMS: 60000,
      serverSelectionTimeoutMS: 30000,
    });

    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};