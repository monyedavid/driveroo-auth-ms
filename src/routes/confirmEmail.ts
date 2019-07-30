import { Request, Response } from "express";
import { redis } from "../cache";
import Models from "../models/main.models.exports";

export const confirmEmamil = async (req: Request, res: Response) => {
    const { id, type } = req.params;
    const userId = await redis.get(id);
    if (userId) {
        await Models[type].findOneAndUpdate(
            { user: id },
            { $set: { confirmed: true } },
            { new: true }
        );
        await redis.del(id);
        res.send("ok");
    } else {
        res.send("Invalid");
    }
};
