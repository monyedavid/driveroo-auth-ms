import { createWriteStream } from "fs";
import * as shortid from "shortid";

const storeUpload = async ({ createReadStream, filename }): Promise<any> => {
    const path = `images/${shortid.generate()}`;

    return new Promise((resolve, reject) =>
        createReadStream()
            .pipe(createWriteStream(path))
            .on("finish", () => resolve({ path }))
            .on("error", reject)
    );
};

export const processUpload = async (upload: any) => {
    const { createReadStream } = await upload;
    return createReadStream;
};
