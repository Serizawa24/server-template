
import User from "../models/User.js";
import SongSuggest from "../models/SongSuggest.js"
/* READ */
export const setAdmin = async (req,res) => {
  try{
    const { uid } = req.body;
    const user = await User.findOne({ _id: uid });
    //set user admin
    user.role = "admin";
    await user.save();
    return res.status(200).json({ message: `${user.name} is admin now!` });
  } catch(e) {
    return res.status(504).json({ message: err.message });
  }
}

export const getUser = async (req, res) => {
  try {
    let { id } = req.params;
    let user = await User.findOne({ _id:id },);
    const { password: _, _id, image, ...userData } = user._doc;
    const userFormat = {
      ...userData,
      id: _id,
      image: `${process.env.APP_URL}/assets/${image}`,
    };
    res.status(200).json(userFormat);
  } catch (err) {
    return res.status(504).json({ message: err.message });
  }
};

export const getUserFavoritesSong = async (req, res) => {
  try {
    const userId = req.user.id; // Assume userId is passed in request params
    const { sortType } = req.query;
    let songs;
    switch (sortType) {
      case "newest":
        songs = await SongSuggest.find({ favorites: userId }).sort({ createdAt: -1 });

        break;
      case "listens":
        songs = await SongSuggest.find({ favorites: userId }).sort({ listens: -1 });

        break;
      default:
        songs = await SongSuggest.find({ favorites: userId }).sort({ listens: -1 });
        break;
    }
    // Extract the favorite songs from userFavorites
    const songsWithAudio = songs.map(song => ({
      ...song.toObject(),
      audio: `${process.env.APP_URL}/Users/${song.uid}/${song.name}`
    }));
    res.status(200).json({ songsWithAudio });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const getUserSong = async (req, res) => {
  try {
    const id = req.user.id;
    const { sortType } = req.query;
    let songs;
    switch (sortType) {
      case "newest":
        songs = await SongSuggest.find({uid:id}).sort({ createdAt: -1 });

        break;
      case "listens":
        songs = await SongSuggest.find({uid:id}).sort({ listens: -1 });

        break;
      default:
        songs = await SongSuggest.find({uid:id}).sort({ listens: -1 });
        break;
    }
    const songsWithAudio = songs.map(song => ({
      ...song.toObject(),
      audio: `${process.env.APP_URL}/Users/${song.uid}/${song.name}`
    }));
    res.status(200).json({ songsWithAudio });
  } catch (err) {
    return res.status(504).json({ message: err.message });
  }
};
export const getAllUser = async (req, res) => {
  const page = parseInt(req.query.page) || 1; 
  const perPage = 5; 
  try {
    const totalUsers = await User.countDocuments()
    const users = await User.find().sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage) 
      let userFormat = users.map((list) => {
        let image = `${process.env.APP_URL}/assets/${list.image}`;
        let id = list._id
        delete list._doc._id
        delete list._doc.password
        return {
          id: id,
          ...list._doc,
          image: image,
        };
      });
    return res.status(200).json({ total: totalUsers,perPage: perPage,totalPages: Math.ceil(totalUsers / perPage),data:userFormat });
  } catch (err) {
    return res.status(504).json({ message: err.message });
  }
};

export const banUser = async (req,res)=>{
  try{
    const { uid } = req.body;
    const user = await User.findOne({ _id: uid });
    //set user admin
    user.isBan = true;
    await user.save();
    return res.status(200).json({ message: `${user.name} is banned now!` });
  } catch(e) {
    return res.status(504).json({ message: err.message });
  }
}
export const unBanUser = async (req,res)=>{
  try{
    const { uid } = req.body;
    const user = await User.findOne({ _id: uid });
    //set user admin
    user.isBan = false;
    await user.save();
    return res.status(200).json({ message: `${user.name} is unban now!` });
  } catch(e) {
    return res.status(504).json({ message: err.message });
  }
}
