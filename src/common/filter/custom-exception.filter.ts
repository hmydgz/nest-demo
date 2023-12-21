import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from '../exception/custom.exception';

@Catch(CustomException)
export class CustomErrorFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const code = exception.code

    console.log('CustomErrorFilter')

    res.status(200).send({
      code,
      message: exception.message,
      data: null,
    })
  }
}
