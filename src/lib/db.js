// import mongoose from 'mongoose';

// export const connectDB = async () => {
//   try {
//     // Replace with your actual Atlas connection string
//     const dbURI = process.env.MONGO_URI;
    
//     if (!dbURI) {
//       throw new Error("MONGO_URI is not defined in .env");
//     }

//     await mongoose.connect(dbURI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       socketTimeoutMS: 60000,
//       serverSelectionTimeoutMS: 30000,
//     });

//     console.log("✅ MongoDB Atlas Connected Successfully");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error);
//     process.exit(1);
//   }
// };


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
//       socketTimeoutMS: 60000,
//       serverSelectionTimeoutMS: 30000,
//     });

//     console.log("✅ MongoDB Atlas Connected Successfully");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error.message);
//     console.error("🔎 Error Stack:", error.stack);
//     throw error; // Ensure it propagates the error to Vercel logs
//   }
// };

// import mongoose from 'mongoose';

// export const connectDB = async () => {
//   try {
//     const dbURI = process.env.MONGO_URI;
//     if (!dbURI) {
//       throw new Error("MONGO_URI is not defined in .env");
//     }

//     await mongoose.connect(dbURI);

//     console.log("✅ MongoDB Atlas Connected Successfully");
//   } catch (error) {
//     console.error("❌ MongoDB Connection Error:", error.message);
//     console.error("🔎 Error Stack:", error.stack);
//     throw error; // Ensure it propagates the error to Vercel logs
//   }
// };

import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  // If already connected, reuse connection
  if (isConnected) {
    console.log("🔄 Using existing database connection");
    return;
  }

  try {
    const dbURI = process.env.MONGO_URI;
    if (!dbURI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(dbURI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    isConnected = true;
    console.log("✅ MongoDB Atlas Connected Successfully");
  } catch (error) {
    isConnected = false;
    console.error("❌ MongoDB Connection Error:", error.message);
    console.error("🔎 Error Details:", error.stack?.substring(0, 200) || "No stack trace");
    throw error; // Propagate the error
  }
};
