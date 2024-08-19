import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


 const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  });

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail server is running...");
  }
});

export default transporter