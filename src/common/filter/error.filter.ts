import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()

    console.log('ErrorFilter')

    try {
      const code = exception.getStatus()
      res.status(200).send({
        code,
        message: exception.message,
        data: null,
      })
    } catch (error) {
      console.log(error)
      res.send({ code: 500, message: '哦豁，服务器内部错误', data: null })
    }
  }
}
