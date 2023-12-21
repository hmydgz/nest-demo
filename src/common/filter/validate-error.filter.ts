import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exception/validate.exception';

@Catch(ValidationException)
export class ValidateErrorFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    res.status(200).send({
      code: 400,
      message: exception.errors.map(v => Object.values(v.constraints)).join('; '),
      data: null,
    })
  }
}
