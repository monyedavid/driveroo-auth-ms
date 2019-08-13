import { Redis } from "ioredis";
import * as express from "express";

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
    res: express.Response;
    AdminloggedIn?: boolean;
    message: string;
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
