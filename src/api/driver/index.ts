import * as express from "express";
import { avatrtUploads } from "../../middlewares/multer";
const router = express.Router();

router.post("/", (req, res) => {
    console.log(req.files, "req|files");
});

export default router;
