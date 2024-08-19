import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRoute from "./routes/user.js"
import booksRoute from "./routes/books.js"
import cors from 'cors'
import orderRouter from "./routes/orders.js";
import nodemailer from 'nodemailer'
import stripe from 'stripe'
import { handleWebhook } from "./controllers/orders.js";
import orders from "./models/orders.js";
import user from "./models/user.js";
import files from "./models/files.js";
dotenv.config();
const app=express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PUT"] }));
app.post("/webhook", express.raw({ type: "application/json" }),async(request, response) => {

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
);




app.use(express.json());


app.get("/",(req,res)=>{
  res.send({messsage:"Hello mannnnn"})
})
app.use("/user",userRoute);
app.use("/books",booksRoute);
app.use("/orders", orderRouter)


mongoose.connect(process.env.MONGO_URI)  .then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Failed to connect to MongoDB", err));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

