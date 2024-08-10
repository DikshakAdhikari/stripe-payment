import express from 'express'
import { signup,signin } from '../controllers/user.js';
import { verifyToken } from '../middlewares/auth.js';
const router=express.Router();

router.post('/register',signup);
router.post('/login',signin);
router.get('/validateToken', verifyToken, async(req,res)=> {
    res.status(200).json({message:"verification successfull"})
})


export default router;