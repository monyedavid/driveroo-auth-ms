import * as shortid from "shortid";
import { createWriteStream } from "fs";

const storeUpload = async ({ stream, filename }: any): Promise<any> => {
    const id = shortid.generate();
    const path = `images/${id}-${filename}`;

    return new Promise((res, rej) =>
        stream
            .pipe(createWriteStream(path))
            .on("finish", () => res({ id, path }))
            .on("error", rej)
    );
};

export const processUpload = async (upload: any) => {
    const { stream, filename, mimetype, encoding } = await upload;
    const { id, path } = await storeUpload({ stream, filename });
};
