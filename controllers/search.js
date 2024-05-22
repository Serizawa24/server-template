import User from "../models/User.js";
import Song from "../models/SongSuggest.js";

export const getSearchUser = async (req, res) => {
  try {
    const { q } = req.query;
    const user = await User.find({
      $or: [
        { name: { $regex: new RegExp(q, 'i') } },
        { email: q }
      ],
      
    });
    res.status(200).json({q,user});
  } catch (err) {
    res.status(504).json({ message: err.message });
  }
};

export const getSearchSong = async (req, res) => {
  try {
    const { q, sortType } = req.query;
    if(q == "") return res.status(200).json({ q, songs: [] });
    let songs = await Song.find({
      $or: [
        { name: { $regex: new RegExp(q, 'i') } },
        { author: { $regex: new RegExp(q, 'i') } }
      ],
    });

    switch (sortType) {
      case "newest":
        songs = songs.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "listens":
        songs = songs.sort((a, b) => b.listens - a.listens);
        break;
      default:
        songs = songs.sort((a, b) => b.listens - a.listens);
        break;
    }

    const songsWithAudio = songs.map(song => ({
      ...song.toObject(),
      audio: `${process.env.APP_URL}/Users/${song.uid}/${song.name}`
    }));

    res.status(200).json({ q, songs: songsWithAudio });
  } catch (err) {
    res.status(504).json({ message: err.message });
  }
};