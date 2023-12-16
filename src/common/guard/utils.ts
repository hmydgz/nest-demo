import { User } from "@app/db/schemas";
import { ExecutionContext } from "@nestjs/common";
import { Request, Response } from "express";

export function getGuardReqRes<T = { user: User & { _id: string } }>(context: ExecutionContext): {
  req: Request & T,
  res: Response
} {
  const http = context.switchToHttp();
  return {
    req: http.getRequest() as Request & T,
    res: http.getResponse() as Response,
  }
}