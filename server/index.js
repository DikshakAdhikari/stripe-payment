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
    console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    const sig = request.headers["stripe-signature"];

    let event;
    const productFile =
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
      case 'payment_intent.canceled':
        session = event.data.object;
        // Then define and call a function to handle the event payment_intent.canceled
        break;
      case 'payment_intent.payment_failed':
        session = event.data.object;
        // Then define and call a function to handle the event payment_intent.payment_failed
        break;
      case 'payment_intent.succeeded':
        session = event.data.object;
        // Send invoice email using nodemailer
      const updatedProduct = await orders.findOneAndUpdate(
        { paymentIntentId: session.id },
        { status: "success" },
        { new: true }
      );

      // console.log(product);
      // for(let i=0;i<updatedProduct.products.length; i++){
      //   const fileId= 
      // }
      const filesUrls=[]
      await Promise.all(updatedProduct.products.map(async(val, i)=>{
        console.log(val.fileId);
        const fileData= await files.findOne({_id:val.fileId})
        filesUrls.push(fileData.file)
      }))

        const obj={
          orderId: updatedProduct.id,
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

        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // Send mail with defined transport object
          const info = await transporter.sendMail({
            from: process.env.EMAIL, // sender address
            to: emailTo, // list of receivers
            subject: "Thanks for the payment for the product", // Subject line
            text: "Thanks for the payment for the product", // Plain text body
            html: `
              Hello ${session.metadata.email}, thanks for the payment of the product.<br />
              Here's the link to the Books from Google Drive. You can download the files by visiting these links:<br />
              ${filesUrls.map((val) => `<a href="${val}">${val}</a>`).join('<br />')}
            `, // HTML body
          });
          
          console.log("Message sent: %s", info.messageId);
        }
        main().catch(console.error);
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }


    // Return a 200 response to acknowledge receipt of the event
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

