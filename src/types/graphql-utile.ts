import { Redis } from "ioredis";

export interface Session extends Express.Session {
    userId?: string;
    userfullname?: string;
    mobile?: string;
    token?: string;
    model?: AUTH.model;
}

export interface Context {
    redis: Redis;
    url: string;
    session: Session;
    req: Express.Request;
}

export type Resolver = (
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export type GRAQPHQLmiddlewareFunc = (
    resolver: Resolver,
    parent: any,
    args: any,
    context: Context,
    info: any
) => any;

export interface ResolverMap {
    [key: string]: {
        [key: string]: Resolver;
    };
}
