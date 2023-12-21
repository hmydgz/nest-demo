import { HttpException } from "@nestjs/common";
import { ValidationError } from "class-validator";

export class ValidationException extends HttpException {
  errors: ValidationError[]
  constructor(errors: ValidationError[]) {
    super('', 200)
    this.errors = errors
  }
}