import { Request, Response } from "express";
import { redis } from "../cache";
import Models from "../models/main.models.exports";

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
        res.json({ ok: true });
        // rediret to login
    } else {
        res.send("Invalid");
    }
};
