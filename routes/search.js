import express from 'express';
import { getSearchSong, getSearchUser } from '../controllers/search.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* READ */

router.get("/user",getSearchUser);
router.get("/song",getSearchSong);
export default router;