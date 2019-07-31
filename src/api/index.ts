import * as express from "express";
import * as morgan from "morgan";
import * as helmet from "helmet";
import * as bp from "body-parser";

import { notFound, errorHandler } from "../app/app.middleware";
import { Auth } from "../class/auth/auth.main.class";
const router = express.Router();

router.use(morgan("dev"));
router.use(helmet());
router.use(bp.urlencoded({ extended: false }));
router.use(bp.json());

router.get("/", (req, res) => {
    res.json({
        message: "API - 👋🌎🌍🌏"
    });
});

router.post("/login", async (req, res, next) => {
    const { email, password, model } = req.body;
    const url = req.protocol + "://" + req.get("host");
    const service = new Auth(url);
    const result = await service.login(
        { email, password },
        model,
        req.session,
        req.sessionID
    );

    if (result.ok) {
        return res.json({ ok: true });
    }
    if (!result.ok) {
        return res.json({ ok: result.error });
    }
});

router.get("/me", async (req, res, next) => {
    const service = new Auth();
    const result = await service.me(req.session);
    if (!result.ok) {
        return res.status(422).json({ error: result.error });
    }

    if (result.ok)
        return res.json({
            user: result.user,
            token: result.token
        });
});

router.use(notFound);
router.use(errorHandler);

export default router;
