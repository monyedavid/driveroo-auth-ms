import * as express from "express";
import * as morgan from "morgan";
import * as helmet from "helmet";
import * as bp from "body-parser";

import { notFound, errorHandler } from "../app/app.middleware";
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

router.use(notFound);
router.use(errorHandler);

export default router;
