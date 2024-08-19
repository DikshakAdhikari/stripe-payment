import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import Stripe from 'stripe';
import orders from '../models/orders.js';
import user from '../models/user.js';
import files from '../models/files.js';
import stripe from 'stripe'
dotenv.config()

const stripeFunction = new Stripe(process.env.STRIPE_PASSWORD, {
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
      break;
    case 'payment_intent.succeeded':
      session = event.data.object;
      
    const updatedProduct = await orders.findOneAndUpdate(
      { paymentIntentId: session.id },
      { status: "success" },
      { new: true }
    );


    const filesUrls=[]
    await Promise.all(updatedProduct.products.map(async(val)=>{
      const fileData= await files.findOne({_id:val.fileId})
      filesUrls.push(fileData.file)
    }))

      const obj={
        orderId: updatedProduct.id,
        status: updatedProduct.status,
        products: updatedProduct.products
      }

      const userData= await user.findOneAndUpdate({_id:session.metadata.userId}, {
        $push:{myOrders:obj}
      },{new:true})

      const emailTo = session.metadata.email;
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      
      async function main() {
        
        const info = await transporter.sendMail({
          from: process.env.EMAIL, 
          to: emailTo, 
          subject: "Thanks for the payment for the product", 
          text: "Thanks for the payment for the product", 
          html: `
            Hello ${session.metadata.email}, thanks for the payment of the product.<br />
            Here's the link to the Books from Google Drive. You can download the files by visiting these links:<br />
            ${filesUrls.map((val) => `<a href="${val}">${val}</a>`).join('<br />')}
          `,
        });
        
        console.log("Message sent: %s", info.messageId);
      }
      main().catch(console.error);
      
      break;
   
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  response.status(200).send();
    }
