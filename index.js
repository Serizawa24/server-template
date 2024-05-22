import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
//////route
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import searchRoute from './routes/search.js'
import suggestRoute from './routes/song.js'
////////
import { changeAvatar } from "./controllers/auth.js"
import { addSongSuggest } from './controllers/song.js';
///////midleware
import { allowAccess } from './middleware/connect.js';
import { verifyToken } from './middleware/auth.js';
import { adminChecker } from './middleware/adminChecker.js';
/* Configurations */

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use('/assets',express.static(path.join(__dirname,'public/assets')));
app.use('/Users',express.static(path.join(__dirname,'public/Users')));
//allow token
// app.use(allowAccess)
/* File storage */

const storageAvatar = multer.diskStorage({
  destination:function(req,file,cb) {
    cb(null,`public/assets`);
  },
  filename: function(req,file,cb) {
    cb(null,file.originalname);
  }
});

const storageSuggest= multer.diskStorage({
  destination:function(req,file,cb) {
    cb(null,`public//Users/${req.user.id}`);
  },
  filename: function(req,file,cb) {
    cb(null,file.originalname);
  }
});

const uploadAvatar = multer({storage:storageAvatar});
const uploadSuggest = multer({storage:storageSuggest});
/* Routes with files */

app.post('/auth/changeavatar',verifyToken,uploadAvatar.single("image"), changeAvatar);
app.post('/suggest/',verifyToken,uploadSuggest.single("song"), addSongSuggest);
/* Routes */
app.get('/',(req,res)=>{
  return res.json({status:200,message:'Server is running...'})
})

app.use("/auth",authRoutes)
app.use("/users",userRoutes)
app.use("/search",searchRoute)
app.use("/suggest",suggestRoute)
/* Mongoose setup */

const PORT = process.env.PORT || 3423;

mongoose
  .connect(process.env.MONGO_URL,{
  useNewUrlParser:true,
  useUnifiedTopology:true,
  dbName:'mySound',
  }).then(()=>{
    app.listen(PORT,()=>{
      console.log(`Server Port: ${PORT}`)
    })
  }).catch(err=>console.log(`${err}: did not connect`))