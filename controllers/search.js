import User from "../models/User.js";

export const getSearchUser = async (req, res) => {
  try {
    const { q } = req.query;
    const user = await User.find({
      $or: [
        { firstName: { $regex: new RegExp(q, 'i') } },
        { lastName: { $regex: new RegExp(q, 'i') } }
      ]
    });
    res.status(200).json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};