// pages/api/test.js
import { connectDB } from "@/lib/db";

export default async function handler(req, res) {
  try {
    await connectDB();
    res.status(200).json({ message: "Connected to MongoDB Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
