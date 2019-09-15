import * as cloud from "cloudinary";
import { processUpload } from "./image.utils";

export const cloudinary = async (
    attribute: string,
    tags: string,
    public_id: string
) => {
    const { config, uploader } = cloud;
    config({
        cloud_name: process.env.CLOUDINARY_NAME as string,
        api_key: process.env.CLOUDINARY_KEY as string,
        api_secret: process.env.CLOUDINARY_SECRET as string
    });
    let result: any;
    try {
        result = await uploader.upload(attribute, {
            tags,
            public_id
        });
    } catch (error) {
        console.log(error);
    }
    return result.url;
};

export const cloudinaryUpload = async ({ createReadStream }: any) => {
    const { config, v2 } = cloud;
    let resultUrl = "";
    let resultSecureUrl = "";
    config({
        cloud_name: process.env.CLOUDINARY_NAME as string,
        api_key: process.env.CLOUDINARY_KEY as string,
        api_secret: process.env.CLOUDINARY_SECRET as string
    });

    try {
        await new Promise((resolve, reject) => {
            const streamLoad = v2.uploader.upload_stream((error, result) => {
                if (result) {
                    resultUrl = result.secure_url;
                    resultSecureUrl = result.secure_url;
                    resolve(resultUrl);
                } else {
                    reject(error);
                }
            });

            createReadStream().pipe(streamLoad);
        });
    } catch (err) {
        throw new Error(
            `Failed to upload profile picture ! Err:${err.message}`
        );
    }

    return { resultUrl, resultSecureUrl };
};

export const processCloudinaryUpload = async (upload: any) => {
    const createReadStream = await processUpload(upload);
    return await cloudinaryUpload({ createReadStream });
};
