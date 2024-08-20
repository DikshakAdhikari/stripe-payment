import dotenv from 'dotenv'
import Stripe from 'stripe';
import orders from '../models/orders.js';
import stripe from 'stripe'
import sendEmail from '../mail/sendEmail.js';
import updateDBs from '../actions/updateDBs.js';
dotenv.config()

const stripeFunction = new Stripe(process.env.STRIPE_PASSWORD, {
    apiVersion: '2024-06-20'
  });

  const totalItemsPrice= (items)=> {
    let total=0
    items.map((item)=> {
        total += (item.price*item.quantity)
    });
    
    return total.toFixed(2)
}


export const createPayment= async(req,res)=> {
    try{
        const userId= req.clientId
        const {items , address,  payment_intent_id }= req.body;
        const totalAmount=  totalItemsPrice(items)*100
     
        const orderData= {
            amount: totalAmount,
            currency:"usd",
            status:"incomplete",
            deliveryStatus:"none",
            paymentIntentId: payment_intent_id ?  payment_intent_id : null ,
            products:items,
            address: address?address:null,
            userId: userId
        }
        
        if(payment_intent_id){
            const current_intent = await stripeFunction.paymentIntents.retrieve(
                payment_intent_id
              );
            
              if(current_intent){
                const updated_intent = await stripeFunction.paymentIntents.update(
                    payment_intent_id,
                    {amount:totalAmount}
                  );
                
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
                
                  if(!existingOrder){
                    return res.status(400).json({error:"Invalid Intent Id!"})
                  }
                  
                  res.json(updated_intent)
              }             
            
        }else{
            const paymentIntent = await stripeFunction.paymentIntents.create({
                amount: totalAmount,
                currency: 'usd',
                automatic_payment_methods: {
                  enabled: true,
                },
                metadata: { userId: userId, email: req.email  }
            });
            
            orderData.paymentIntentId= paymentIntent.id
            const order= await orders.create(orderData)
            await order.save()
            res.json(paymentIntent)

        }     
}catch(err){
    res.json({message:err})
}
}




export const handleWebhook = async(request,response)=>{
  console.log('Webhook Called!!!!!!!!!');
  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripe(process.env.STRIPE_PASSWORD).webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_SIGNING_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  let session = "";

  switch (event.type) {
    case 'payment_intent.canceled':
      session = event.data.object;
      break;
    case 'payment_intent.payment_failed':
      session = event.data.object;
      const filesUrlFail= await updateDBs(session)
      break;
    case 'payment_intent.succeeded':
      session = event.data.object; 
      const filesUrls= await updateDBs(session)
      console.log(filesUrls);
      const emailTo = session.metadata.email;
      sendEmail(filesUrls, emailTo)
      break;
   
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  // console.log(session);
  response.status(200).send();
    }
