import { Request, Response } from "express";
import { redis } from "../cache";
import Models from "../models/main.models.exports";

const ui =
    process.env.NODE === "development"
        ? process.env.UI_URL_DEV
        : process.env.UI_URL;

export const confirmEmamil = async (req: Request, res: Response) => {
    const { id, type } = req.params;
    const _id = await redis.get(id);
    if (_id) {
        await Models[type].findOneAndUpdate(
            { _id },
            { $set: { confirmed: true } },
            { new: true }
        );
        await redis.del(id);
        return res.redirect(`${ui}/auth`);
        // rediret to login
    } else {
        res.send({ ok: false, message: "Invalid Confimation Link" });
    }
};
