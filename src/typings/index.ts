import { User } from "@app/db/schemas";
import { Request } from "express";
import { createClient } from "redis";

export type RedisClient = ReturnType<typeof createClient>

export type UserReq = Request & { user: User & { _id: string } }