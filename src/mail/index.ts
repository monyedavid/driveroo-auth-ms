import * as nodemailer from "nodemailer";
import * as sgTransport from "nodemailer-sendgrid-transport";

export const main = async (
    reciepient: string,
    url: string,
    subject: string,
    message: string
) => {
    const options = {
        auth: {
            api_key: process.env.SENDGRID_API_KEY
        }
    };
    const transporter = nodemailer.createTransport(sgTransport(options));

    const mailOptions = {
        from: `"Driveroo 👻 Test MAils" <${process.env.MAIL_USER}>`, // sender address
        to: reciepient, // list of receivers
        subject, // Subject line
        text: "Hello?", // plain text body
        html: `<p>
    <b>Hello</b>
    </p>
      <a href="${url}">${message}</a>`
    };

    const info = await transporter.sendMail(mailOptions);
};
