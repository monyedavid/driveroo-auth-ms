import * as express from "express";
import { Auth } from "../../class/auth/auth.main.class";
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "API V1 USER ACTIVITES - 👋🌎🌍🌏"
    });
});

router.post("/login", async (req, res) => {
    const { email, password, model } = req.body;
    const url = req.protocol + "://" + req.get("host");
    const service = new Auth(url);
    const result = await service.login(
        { email, password },
        req.session as any,
        req.sessionID as any,
        model
    );

    if (result.ok) {
        return res.json({ ok: true });
    }
    if (!result.ok) {
        return res.status(422).json({ ok: false, error: result.error });
    }

    return res.status(422).json({ ok: false });
});

router.get("/me", async (req, res) => {
    const service = new Auth();
    const result = await service.me(req.session as any);
    if (!result.ok) {
        return res.status(401).json({ ok: false, error: result.error });
    }

    if (result.ok)
        return res.json({
            ok: true,
            user: result.user,
            token: result.token
        });

    return res.status(422).json({ ok: false });
});

export default router;
