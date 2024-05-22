import express from 'express';
import { getSuggestByListens,deleteSuggestSong, getSongById, increaseListens,addUserToFavorites,getFavoritesUsers } from '../controllers/song.js';
const router = express.Router();
import { verifyToken } from '../middleware/auth.js';
import { adminChecker } from '../middleware/adminChecker.js';
/* READ */

router.get("/listens",getSuggestByListens);
router.get("/favorites/:id",getFavoritesUsers);
router.get("/:id",getSongById)
router.patch("/:id",verifyToken,increaseListens)
router.put("/:id",verifyToken,addUserToFavorites)
router.delete('/:id',verifyToken,deleteSuggestSong)
export default router;