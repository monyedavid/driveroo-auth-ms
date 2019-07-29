import { main } from "../mail/index";

export const sendEmail = async (
    reciepient: string,
    url: string,
    subject: string,
    message: string
) => {
    main(reciepient, url, subject, message).catch(console.error);
};
