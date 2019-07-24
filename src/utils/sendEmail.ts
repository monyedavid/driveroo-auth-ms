import { main } from "../mail/index";

export const sendEmail = async (reciepient: string, url: string) => {
	main(reciepient, url).catch(console.error);
};
