import transporter from "./transporter.js";


const sendEmail = async (filesUrls, emailTo) => {
  try {
    var mainOptions = {
      from: process.env.EMAIL, 
      to: emailTo,
      subject: "Thanks for the payment for the product",
      text: "Thanks for the payment for the product", 
      html: `
        Hello ${emailTo}, thanks for the payment of the product.<br />
        Here's the link to the Books from Google Drive. You can download the files by visiting these links:<br />
        ${filesUrls.map((val) => `<a href="${val}">${val}</a>`).join('<br />')}
      `,
    };
    
    await transporter.sendMail(mainOptions);
  } catch (err) {
    console.log(err);
  }
};

export default sendEmail