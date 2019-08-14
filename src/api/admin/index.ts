import * as express from "express";
import { signTokenStore } from "../../utils/generateTohen";
import { redis } from "../../cache";
const router = express.Router();

router.get("/", (req, res) => {
    res.json({
        message: "API V1 DRIVERR ADMINISTRATOR ACTIVITES - 👋🌎🌍🌏"
    });
});

router.get("/new-registration/:id", async (req, res, next) => {
    const { id } = req.params; // CLient_ID
    const ui =
        process.env.NODE === "development"
            ? process.env.UI_URL_DEV
            : process.env.UI_URL;

    // RETRIEVE cLIENTID FROM REDIS CACHE
    const StringifiedData = await redis.get(id);
    const data: AUTH.IUserAdminLinkData = JSON.parse(StringifiedData);

    if (data) {
        const { email } = data;
        if (email) {
            await redis.del(id);

            const encrypted_id = await signTokenStore(data, redis);
            // redirect to actuall register post || register url
            return res.redirect(`${ui}/auth/${encrypted_id}`);
            // return res.json({
            //     ok: true,
            //     "registration-link": `${ui}/auth/${encrypted_id}`
            // });
        }
        return res.send({
            ok: false,
            mssg: "Expired Administrator Registration Link, Option for renewal?"
        });
    }

    return res.send({
        ok: false,
        mssg:
            "This Registration Link has most likely been used, contact superiors for help"
    });
});

export default router;
