import Stripe from 'stripe'
import express from 'express'
import { verifyToken } from '../middlewares/auth.js';
import { createPayment, handleWebhook } from '../controllers/orders.js';


const orderRouter= express.Router();

orderRouter.post('/create-payment', verifyToken, createPayment )

export default orderRouter
