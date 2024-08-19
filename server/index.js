import express from "express"
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRoute from "./routes/user.js"
import booksRoute from "./routes/books.js"
import cors from 'cors'
import orderRouter from "./routes/orders.js";
import { handleWebhook } from "./controllers/orders.js";

dotenv.config();
const app=express();
app.use(cors({ origin: "*", methods: ["GET", "POST", "DELETE", "PUT"] }));


app.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

app.use(express.json());

app.get("/",(_,res)=>{
  res.send({messsage:"Hello People :) "})
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

