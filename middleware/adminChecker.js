import User from "../models/User.js";
export const adminChecker = async (req,res,next) => {
  try{
  let id = req.user.id;
  let checkAdminUser = await User.findOne({ _id: id, role: "admin" });
  if (!checkAdminUser)
    return res.status(404).json({ message: "you are not admin" });
    next();
  } catch (err) {
    res.status(500).json({error: err.message})
  }
}