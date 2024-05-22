import jwt from "jsonwebtoken";
import User from "../models/User.js";

import fs from "fs";
import path from "path";
import { __dirname } from "../index.js";
/* Register user */

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body; 

    //regex test
    if (name.length < 4)
      return res.status(400).json({ error: "username minimum 4 charactes" });

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))
      return res.status(400).json({ error: "email invalid " });
    
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/.test(
        password
      )
    )
      return res.status(400).json({ error: "Password invalid, 6 characters contain 1 Upper case 1 Number 1 Special Character " });

    const user = await User.findOne({ email: email });
    if (user) return res.status(404).json({ msg: "Email existed. " });
    // let salt = bcrypt.genSalt();
    // let passwordHash = await bcrypt.hash(password, parseInt(salt));
    const newUser = new User({
      name,
      email,
      password,
    });
    const savedUser = await newUser.save();
    
    const userId = savedUser._id; // Assuming _id is the user ID field
   
    const userFolderPath = path.join(__dirname, 'public/Users', userId.toString()); 
    fs.mkdirSync(userFolderPath, { recursive: true });
    
    //
    res.status(201).json({
      message: "success",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
/* Login */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(404).json({ msg: "User does not exist. " });

    const isMatch = password === user.password;
    if (!isMatch) return res.status(400).json({ msg: "Wrong password. " });
    if(user.isBan) return res.status(403).json({ msg: "Banned!!! " });
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const { password: _, _id, image, ...userData } = user._doc;
    const userWithToken = {
      ...userData,
      id: _id,
      image: `${process.env.APP_URL}/assets/${image}`,
      jwtToken: token,
    };
    res.status(200).json(userWithToken);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Change Avatar */
export const changeAvatar = async (req, res) => {
  try {
    const user = req.user;
    const imageInput = req.file.filename;
    const {name} = req.body;
    // Kiểm tra định dạng ảnh
    if (!/\.(png|jpe?g)$/i.test(imageInput))
      return res
        .status(400)
        .json({ error: "Please use .png .jpg .jpeg image" });

    // Lấy thông tin người dùng từ cơ sở dữ liệu
    const userData = await User.findById(user.id);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Lấy tên file ảnh cũ của người dùng
    const oldImage = userData.image;

    // Cập nhật ảnh mới cho người dùng
    userData.image = imageInput;
    userData.name = name;
    const updatedUser = await userData.save();

    // Xóa file ảnh cũ nếu khác với ảnh mặc định và không phải là ảnh mới
    if (oldImage !== "smileblush.png" && oldImage !== imageInput) {
      const imagePath = path.join(__dirname, "public/assets", oldImage);
      fs.unlinkSync(imagePath);
    }

    // Trả về dữ liệu người dùng đã cập nhật kèm theo token

    const { password: _, _id, image, ...userDataWithoutSensitiveInfo } = updatedUser._doc;
    const userWithToken = {
      ...userDataWithoutSensitiveInfo,
      id: _id,
      image: `${process.env.APP_URL}/assets/${image}`,
    };
    
    res.status(200).json(userWithToken);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Change Password */
export const changePassword = async (req, res) => {
  try {
    const user = req.user;
    const { oldPass, newPass } = req.body;

    // Validate new password
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,15}$/.test(newPass)) {
      return res.status(400).json({ error: "New password invalid, must be 6-15 characters, contain 1 uppercase, 1 number, and 1 special character." });
    }
    // Get user from database
    const userData = await User.findOne({ _id:user.id },)
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if old password matches
    const isMatch = oldPass== userData.password;
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    // Hash new password and update
    const passwordHash = newPass;;
    userData.password = passwordHash;
    
    await userData.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};