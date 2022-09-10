import mongoose, { Document } from "mongoose";

interface Cache extends Document {
  key: String,
  value: String,
  ttl: Date
}

const cacheSchema = new mongoose.Schema<Cache>(
  {
    key: { type: String, required: true },
    value: String,
    ttl: { type: Date, required: true }
  },
  { timestamps: true }
);

export const cacheModel = mongoose.model("cache", cacheSchema);
