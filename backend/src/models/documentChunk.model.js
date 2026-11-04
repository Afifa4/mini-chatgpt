import mongoose from "mongoose";

const documentChunkSchema = new mongoose.Schema(
  {
    document: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
    },
    embedding: {
      type: [Number],
      required: true,
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

documentChunkSchema.index({ chat: 1, document: 1 });
documentChunkSchema.index({ document: 1 });

const documentChunkModel = mongoose.model("DocumentChunk", documentChunkSchema);
export default documentChunkModel;
