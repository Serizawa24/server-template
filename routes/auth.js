import express from 'express';
import { changePassword, login,register } from '../controllers/auth.js'
import { verifyToken } from '../middleware/auth.js';
const router = express.Router();

router.post('/login',login);
router.post('/register',register);
router.post('/changepassword',verifyToken,changePassword)
export default router;