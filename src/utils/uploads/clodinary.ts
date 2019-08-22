import * as cloud from "cloudinary";

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
