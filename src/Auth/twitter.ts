import { Request, Response } from "express";
import passport = require("passport");

export const authenticateTwitter = () => {
	passport.authenticate("twitter", {
		// failureRedirect: "/login",
		session: false
	});
};

export const twitTwit = async (req: Request, res: Response) => {
	(req.session as any).userId = (req.user as any).id;
	// @redirect to fromtend
	res.redirect("/");
};

export const twitterMiddleware = () => {
	authenticateTwitter;
	twitTwit;
};
