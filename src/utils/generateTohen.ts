import { sign, verify } from "jsonwebtoken";
import { v4 } from "uuid";
import { Redis } from "ioredis";

const genToken = async (data: any) => {
    let token: string;

    token = sign(
        {
            ...data
        },
        process.env.MICROSERVICE_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return token;
};

export const signTokenStore = async (data: any, redis?: Redis) => {
    const token = await genToken({
        ...data
    });

    // store token in redis id
    if (redis) {
        const id = v4();
        await redis.set(id, token, "ex", 60 * 60 * 24);
        return id;
    }

    return token;
};

interface DecodeRegisterToken {
    invalid: boolean;
    decodedvalue?: any;
}

export const decodeRegToken = async (encrypt_id: string, redis?: Redis) => {
    let CRID = encrypt_id;
    if (redis) {
        CRID = await redis.get(encrypt_id);
    }
    try {
        const decodedvalue: any = await verify(
            CRID,
            process.env.MICROSERVICE_TOKEN_SECRET
        );
        const returnValue: DecodeRegisterToken = {
            invalid: false,
            decodedvalue
        };
        return returnValue;
    } catch (err) {
        return { invalid: true };
    }
};
