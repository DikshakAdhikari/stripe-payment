import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import Stripe from 'stripe';
import orders from '../models/orders.js';
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_PASSWORD, {
    apiVersion: '2024-06-20'

  });

  const totalItemsPrice= (items)=> {
    let total=0
    items.map((item)=> {
        total += (item.price*item.quantity)
    });
    
    return Math.floor(total)
}


export const createPayment= async(req,res)=> {
    try{
        const userId= req.clientId
      
      console.log('ffff',req.email);
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
                  // console.log(updated_intent);
                  res.json(updated_intent)
              }             
            
        }else{
            const paymentIntent = await stripe.paymentIntents.create({
                amount: totalAmount,
                currency: 'usd',
                automatic_payment_methods: {
                  enabled: true,
                },
                metadata: { userId: userId, email: req.email  }
            });
            
            orderData.paymentIntentId= paymentIntent.id
            // console.log(orderData);
            const order= await orders.create(orderData)
            await order.save()
            res.json(paymentIntent)

        }     
}catch(err){
    console.log('sssssssssssssssssssssssssss',err);
    res.json({message:err})
}
}



export const handleWebhook = async(request,response)=>{
  console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrr')
   
      const sig = request.headers["stripe-signature"];
  
      let event;
      const product =
        "https://drive.google.com/file/d/1K5LwwK-4875LMuT2978Yw8vr1MU0oPck/view?usp=drive_link";
  
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
        case "checkout.session.async_payment_failed":
          session = event.data.object;
          console.log(session);
          
          break;
        case "checkout.session.completed":
          session = event.data.object;
          console.log(session);
          // Send invoice email using nodemailer
          const emailTo = session.customer_details.email;
  
          const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
              user: process.env.EMAIL,
              pass: process.env.EMAIL_PASSWORD,
            },
          });
  
          // async..await is not allowed in global scope, must use a wrapper
          async function main() {
            // Send mail with defined transport object
            const info = await transporter.sendMail({
              from: process.env.EMAIL, // sender address
              to: emailTo, // list of receivers
              subject: "Thanks for the payment for the product", // Subject line
              text: "Thanks for the payment for the product", // Plain text body
              html: `
                        Hello ${session.customer_details.email}, thanks for the payment of the product.
                        Here's the link to the product from Google Drive: ${product}. You can download the file by going to this link.
                      `, // HTML body
            });
            // console.log("Message sent: %s", info.messageId);
          }
          main().catch(console.error);
          break;
        // ... handle other event types
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
  
      // Return a 200 response to acknowledge receipt of the event
      response.status(200).send();
    }
