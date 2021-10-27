const express = require("express");
const nodemailer = require("nodemailer");
const multiparty = require("multiparty");
require("dotenv").config();

// instantiate an express app
const app = express();

// For hotmail, to enable it to be used as transporter go to the hotmail account, and change the POP settings to let devices and apps use POP
const transporter = nodemailer.createTransport({
  host: "smtp.live.com", //email provider
  port: 587,
  // SMTP port 587 is one of the best choices for nearly every use case for connecting to Pepipost
  // Port 25 is the default port used for relaying 
  // Port 465 should no longer be used at all
  // Port 2525 used when all other port is blocked
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  },
});

// verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

app.post("/send", (req, res) => {
  //1. Accepts the form data submitted and parse it using multiparty.
  let form = new multiparty.Form();
  let data = {};
  form.parse(req, function (err, fields) {
    console.log(fields);
    Object.keys(fields).forEach(function (property) {
      data[property] = fields[property].toString();
      // console.log(property) // check the available properties(name)
    });

    //2. You can configure the object however you want
    // After parsing it, create a mail object with from, to, subject and text properties.
    const mail = {
      from: `${data.firstName} ${data.lastName} <bassey.rhema@hotmail.com>`, //Essentially outlook/hotmail doesn't let you send email from a account you don't own. 
      //So take the original user's email and put it in the body of the text then make the FROM to be your email TO your email.
      to: "bassey.rhema@hotmail.com",
      // to: process.env.EMAIL,
      subject: data.subject,
      // text: `${data.firstName} <${data.email}> \n${data.message}`,
      html: `<p><b>First Name:</b> ${data.firstName}<p>
      <p><b>Last Name:</b> ${data.lastName}<p>
      <p><b>Email:</b> ${data.email}<p>
      <p><b>Phone Number:</b> ${data.phoneNumber}<p>
      <p style="margin-top: 50px">${data.message}</p>`,
    };

    //3. Use transporter.sendMail() to send the email and done.
    transporter.sendMail(mail, (err, data) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.status(200).send("Email successfully sent to recipient! You can close the tab.");
        // res.status(200).json({status: 'success'})
      }
    });
  });
});

//make the contact page the the first page on the app
app.route("/").get(function (req, res) {
  res.sendFile(process.cwd() + "/public/index.html");
});

//port will be 5000 for testing
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});
