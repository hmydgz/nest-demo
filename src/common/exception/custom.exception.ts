import { HttpException } from "@nestjs/common";

export class CustomException extends HttpException {
  code: number
  constructor(message: string, code: number) {
    super(message, 200)
    this.code = code
  }
}