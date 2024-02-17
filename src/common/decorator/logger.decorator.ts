import { RequestMethod, createParamDecorator } from '@nestjs/common';
import { METHOD_METADATA, /* ROUTE_ARGS_METADATA */ } from '@nestjs/common/constants';
import { logger } from '../logger';
import * as winston from 'winston';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';

const MethodSet = new Set(Object.values(RequestMethod))

export const Logger = (label?: string): ClassDecorator => {
  return (target: any) => {
    Object.getOwnPropertyNames(target.prototype).forEach((propertyName) => {
      const descriptor = Object.getOwnPropertyDescriptor(target.prototype, propertyName);
      if (descriptor && typeof descriptor.value === 'function') {
        const originalMethod = descriptor.value as (...rest: any) => any;
        const methodMetadata = Reflect.getMetadata(METHOD_METADATA, originalMethod)
        const prefix = `${label ? `${label} ` : ''}${target.name} ${originalMethod.name}`
        if (MethodSet.has(methodMetadata)) {
          descriptor.value = async function (...rest: any[]) {
            const ctx = rest.pop() as LogCtx
            try {
              ctx.logger.info(`${prefix} :`, { args: rest.map(v => v instanceof ExecutionContextHost ? 'ExecutionContextHost' : v) })
              const result = await originalMethod.apply(this, rest)
              ctx.logger.info(`${prefix} :`, { return: result })
              return result;
            } catch (error) {
              ctx.logger.error(`${prefix} error:${error.message}\n${error.stack}`)
              throw error
            }
          };
          // 手动挂一个上下文
          LoggerCtx()(target.prototype, propertyName, originalMethod.length)
          Reflect.getMetadataKeys(originalMethod).forEach((key: string) => {
            const metadata = Reflect.getMetadata(key, originalMethod)
            Reflect.defineMetadata(key, metadata, descriptor.value)
          })
          Object.defineProperty(target.prototype, propertyName, descriptor)
          // console.log(propertyName, Reflect.getMetadata(ROUTE_ARGS_METADATA, target, propertyName))
        }
      }
    });
  }
}

export type LogCtx = ExecutionContextHost & {
  logger: winston.Logger
}
export const LoggerCtx = createParamDecorator((data: unknown, ctx: ExecutionContextHost) => {
  const req = ctx.switchToHttp().getRequest<Request & { requsetId: string }>()
  if (!req.requsetId) req.requsetId = randomUUID()
  const _ctx = ctx as LogCtx
  _ctx.logger = new Proxy(logger, {
    get(target, p) {
      if (typeof target[p] === 'function') {
        return (...rest: any[]) => {
          if (rest.length) {
            if (typeof rest[0] === 'string') {
              rest[0] = `${req.requsetId} ${rest[0]}`
            }
          }
          return target[p](...rest)
        }
      } else {
        return target[p]
      }
    }
  })
  return _ctx
})