import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

type ValidationError2 = ValidationError & {
  response: {
    message: string | string[];
    error: string;
  }
}

@Catch()
export class ValidateErrorFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    console.log((exception as ValidationError2).response)

    res.status(200).send({
      code: 500,
      message: (exception as ValidationError2).response.message,
      data: null,
    })
  }
}
