import mongoose from "mongoose";

const SongSuggestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    uid:{
      type: String,
      require: true
    },
    listens:{
      type: Number,
      default: 0
    },
    duration:{
      type: String,
      default: "0:0"
    },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }] // Mảng chứa các ObjectID của người dùng yêu thích bài hát
  },
  { timestamps: true }
);

const SongSuggest = mongoose.model("SongSuggest", SongSuggestSchema);
export default SongSuggest;
