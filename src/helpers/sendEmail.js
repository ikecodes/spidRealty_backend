const dotenv = require("dotenv");
const ejs = require("ejs");
const path = require("path");

dotenv.config();
const sgMail = require("@sendgrid/mail");

let key = `${process.env.SENDGRID_API_KEY}`;
let from = `${process.env.SENDGRID_EMAIL}`;

sgMail.setApiKey(key);

const Mail = async (options) => {
  try {
    let { mail, subject, firtname, token, email } = options;
    const data = await ejs.renderFile(
      path.join(__dirname, email),
      { firstname: firtname, token: token },
      {
        async: true,
      }
    );
    const msg = {
      to: mail,
      from,
      subject: subject,
      html: data,
    };
    await sgMail.send(msg);
  } catch (error) {
    console.log("error mailer", error);
    // throw new createError.Conflict(
    //   `Request was succesfull, but an Error occured sending confirmation mail`
    // );
  }
};
module.exports = Mail;
