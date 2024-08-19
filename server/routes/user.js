import express from 'express'
import { signup,signin } from '../controllers/user.js';
import { verifyToken } from '../middlewares/auth.js';
import user from '../models/user.js';
const router=express.Router();

router.post('/register',signup);
router.post('/login',signin);
router.get('/validateToken', verifyToken, async(req,res)=> {
    res.status(200).json({message:"verification successfull"})
})
router.get('/orders',verifyToken, async(req,res)=> {
    try{
        const orders= await user.findOne({_id:req.clientId});
        res.json({myOrders:orders.myOrders})
    }catch(err){
        res.json(err)
    }
})


export default router;