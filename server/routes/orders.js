import Stripe from 'stripe'
import express from 'express'
import { verifyToken } from '../middlewares/auth.js';
import orders from '../models/orders.js';

const stripe = new Stripe('sk_test_51PjdabHaMXngjvdduggTkmFUaqWA2gNBNyUtY9cUCxKRzlq53j2ZDY80vssnl5iEjOyL6BMr8MiX60HmGpJEmlCy00YJzMl1Pn', {
    apiVersion: '2023-08-16',
  });
const orderRouter= express.Router();


const totalItemsPrice= (items)=> {
    let total=0
    items.map((item)=> {
        total += (item.price*item.quantity)
    });
    console.log(total);
    return Math.floor(total)
}

orderRouter.post('/create-payment', verifyToken, async(req,res)=> {
        try{
            const id= '33434'
            const {items , address }= req.body;
            const totalAmount=  totalItemsPrice(items)*100
            const orderData= {
                amount: totalAmount,
                currency:"usd",
                status:"incomplete",
                deliveryStatus:"none",
                paymentIntentId: payment_intent_id ,
                products:items,
                address: address
            }
            
            if(payment_intent_id){
                console.log(payment_intent_id);
                const current_intent = await stripe.paymentIntents.retrieve(
                    payment_intent_id
                  );
                //   console.log('current Intent:e ', current_intent);
                  if(current_intent){
                    const updated_intent = await stripe.paymentIntents.update(
                        payment_intent_id,
                        {amount:totalAmount}
                      );
                    //   console.log('updatedd intentt: ',updated_intent);
                      const [existingOrder, updatedOrder] = await Promise.all([
                        orders.findOne({ paymentIntentId: payment_intent_id }),
                        orders.findOneAndUpdate(
                            { paymentIntentId: payment_intent_id },
                            {
                                amount: totalAmount,
                                products: items,
                            },
                            { new: true } 
                        )
                    ]);
                    //   console.log('existingg order: ', existingOrder);
                      if(!existingOrder){
                        return res.status(400).json({error:"Invalid Intent Id!"})
                      }
                      res.json({paymentIntent: updated_intent })
                  }             
                
            }else{
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: totalAmount,
                    currency: 'usd',
                    automatic_payment_methods: {
                      enabled: true,
                    },
                });
    
                orderData.paymentIntentId= paymentIntent.id
                console.log(orderData);
                const order= await orders.create(orderData)
                await order.save()

                res.json(paymentIntent)

            }
            
            
    }catch(err){
        console.log('damnnn');
        res.json({message:err})
    }
} )


export default orderRouter
