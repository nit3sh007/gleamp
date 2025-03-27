
// import mongoose from "mongoose";

// const NewsArticleSchema = new mongoose.Schema(
//   {
//     country: String,
//     countryCode: String,
//     source: String,
//     headline: String,
//     summary: String,
//     url: { type: String, unique: true }, // Prevent duplicate URLs
//     imageUrl: String,
//     latitude: Number,
//     longitude: Number,
//     publishedAt: { type: Date, required: true }, // ✅ Add this field to store correct article publish date
//   },
//   { timestamps: true } // Keeps createdAt & updatedAt automatically
// );

// // Fix OverwriteModelError
// export const NewsArticle = mongoose.models.NewsArticle || mongoose.model("NewsArticle", NewsArticleSchema);


import mongoose from "mongoose";

const NewsArticleSchema = new mongoose.Schema(
  {
    country: String,
    countryCode: String,
    source: String,
    headline: String,
    summary: String,
    url: { type: String, unique: true }, // Prevent duplicate URLs
    imageUrl: String,
    latitude: Number,
    longitude: Number,
    publishedAt: { type: Date, required: true },
    category: { type: String, default: 'All' } // Add category field
  },
  { timestamps: true } // Keeps createdAt & updatedAt automatically
);

// Create index for faster queries
NewsArticleSchema.index({ country: 1, category: 1, publishedAt: -1 });

// Fix OverwriteModelError
export const NewsArticle = mongoose.models.NewsArticle || mongoose.model("NewsArticle", NewsArticleSchema);