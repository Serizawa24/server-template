import SongSuggest from "../models/SongSuggest.js";

import fs from "fs";
import path from "path";
import { __dirname } from "../index.js";
import getMp3Duration from "get-mp3-duration";
//read
export const getSuggestByListens = async (req, res) => {
  try {
    const { sortType } = req.query;
    let songs;
    switch (sortType) {
      case "newest":
        songs = await SongSuggest.find().sort({ createdAt: -1 });

        break;
      case "listens":
        songs = await SongSuggest.find().sort({ listens: -1 });

        break;
      default:
        songs = await SongSuggest.find().sort({ listens: -1 });
        break;
    }

    const songsWithAudio = songs.map((song) => ({
      ...song.toObject(),
      audio: `${process.env.APP_URL}/Users/${song.uid}/${song.name}`,
    }));
    res.status(200).json({ songsWithAudio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getSongById = async (req, res) => {
  try {
    let { id } = req.params;
    let song = await SongSuggest.findOne({ _id: id });

    const songWithAudio = {
      ...song.toObject(),
      audio: `${process.env.APP_URL}/Users/${song.uid}/${song.name}`,
    };

    res.status(200).json(songWithAudio);
  } catch (err) {
    return res.status(504).json({ message: err.message });
  }
};
export const getFavoritesUsers = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await SongSuggest.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Không tìm thấy bài hát" });
    }

    // Lấy mảng chứa các user ID của người dùng yêu thích bài hát
    const favoriteUsers = song.favorites;

    return res.status(200).json(favoriteUsers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//add
export const addSongSuggest = async (req, res) => {
  try {
    let userss = req.user.id;
    let song = req.file.filename;
    if (!/\.(mp3|wav)$/i.test(song))
      return res.status(400).json({ error: "Please use .mp3 or .wav file" });
    let { author } = req.body;

    const filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);
    const durationMs = getMp3Duration(buffer);
    
    // Convert duration from milliseconds to minutes and seconds
    const durationMinutes = Math.floor(durationMs / 60000);
    const durationSeconds = Math.floor((durationMs % 60000) / 1000);
    
    // Format the duration as "mm:ss"
    const durationFormatted = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
    
    const newSong = new SongSuggest({
      uid: userss,
      author,
      name: song,
      duration: durationFormatted, // Save formatted duration
    });

    const songCheck = await SongSuggest.findOne({ name: song, uid: userss });
    if (songCheck) return res.status(404).json({ msg: "Song existed. " });

    const savedSong = await newSong.save();
    return res.status(200).json({ savedSong });
  } catch (err) {
    res.status(504).json({ message: err.message });
  }
};

//put
export const addUserToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const song = await SongSuggest.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Không tìm thấy bài hát" });
    }

    const userIndex = song.favorites.indexOf(userId);
    if (userIndex !== -1) {
      song.favorites.splice(userIndex, 1);
      await song.save();
      return res.status(200).json({
        message:
          "Người dùng đã thích bài hát này trước đó, đã được loại bỏ khỏi danh sách yêu thích",
      });
    } else {
      song.favorites.push(userId);
      await song.save();
      return res
        .status(200)
        .json({ message: "Thêm vào danh sách yêu thích thành công" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//patch
export const increaseListens = async (req, res) => {
  try {
    const { id } = req.params;

    const song = await SongSuggest.findById(id);

    if (!song) {
      return res.status(404).json({ message: "Không tìm thấy bài hát" });
    }

    song.listens += 1;

    await song.save();

    return res.status(200).json({ message: "Tăng số lần nghe thành công" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
//delete
export const deleteSuggestSong = async (req, res) => {
  try {
    let { id } = req.params;
    let checkSong = await SongSuggest.findOneAndDelete({
      _id: id,
      uid: req.user.id,
    });
    if (!checkSong) return res.status(404).json({ message: "cant find Song" });

    fs.unlinkSync(
      path.join(__dirname, "public/Users", checkSong.uid, checkSong.name)
    );

    return res.status(200).json({ message: "done" });
  } catch (err) {
    res.status(504).json({ message: err.message });
  }
};
