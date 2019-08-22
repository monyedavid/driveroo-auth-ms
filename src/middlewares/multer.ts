import * as multer from "multer";
import * as Datauri from "datauri";
import * as path from "path";

const storage = multer.memoryStorage();
export const avatrtUploads = multer({ storage }).fields([
    { name: "avatar" },
    { name: "driversLicense" }
]);

/**
 * @description This function converts the buffer to data url
 * @param {Object} req containing the field object
 * @returns {String} The data url from the string buffer
 */
const dUri = new Datauri();

export const dataUri = (file: any) =>
    dUri.format(path.extname(file.originalname).toString(), file.buffer);
