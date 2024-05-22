import express from 'express';
import { 
  getUser,
  getAllUser,
  getUserFavoritesSong,
  getUserSong,
  setAdmin,
  banUser,
  unBanUser,
} from '../controllers/users.js';

import {verifyToken} from '../middleware/auth.js'
import {adminChecker} from '../middleware/adminChecker.js'
const router = express.Router();

/* READ */
router.get("/favorite",verifyToken,getUserFavoritesSong)
router.get("/song",verifyToken,getUserSong)
router.get("/:id",getUser);
router.get("/",verifyToken,adminChecker,getAllUser);
router.patch("/setadmin",verifyToken,adminChecker,setAdmin);
router.patch("/banuser",verifyToken,adminChecker,banUser);
router.patch("/unbanuser",verifyToken,adminChecker,unBanUser);
export default router