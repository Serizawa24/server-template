import express from 'express';
import { getSearchUser, } from '../controllers/search.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

/* READ */

router.get("/",verifyToken,getSearchUser);


export default router;