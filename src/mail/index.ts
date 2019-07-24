import * as nodemailer from "nodemailer";

export const main = async (reciepient: string, url: string) => {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GMAIL_USERNAME as string,
			pass: process.env.GMAIL_PASSWORD as string
		}
	});

	const mailOptions = {
		from: `"Candy 👻" <${process.env.GMAIL_USER}>`, // sender address
		to: reciepient, // list of receivers
		subject: "Hello Granny ✔ Confirm Email", // Subject line
		text: "Hello to Myself?", // plain text body
		html: `<p>
    <b>Hello</b> and whats good 
    </p>
      <a href="${url}">Here's your confirmation email</a>`
	};

	const info = await transporter.sendMail(mailOptions);

	console.log("Message sent: %s", info.messageId);

	console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};
