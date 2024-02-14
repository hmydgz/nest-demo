import { RequestMethod } from '@nestjs/common';
import { METHOD_METADATA } from '@nestjs/common/constants';
import { logger } from '../logger';
import { randomUUID } from 'crypto';

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
            const requsetId = randomUUID()
            const _prefix = `${requsetId} ${prefix}`
            try {
              logger.info(`${_prefix} :`, { args: rest })
              const result = await originalMethod.apply(this, rest)
              logger.info(`${_prefix} :`, { return: result })
              return result;
            } catch (error) {
              logger.error(`${_prefix} error:${error.message}\n${error.stack}`)
              throw error
            }
          };
          Reflect.getMetadataKeys(originalMethod).forEach((key: string) => {
            const metadata = Reflect.getMetadata(key, originalMethod)
            Reflect.defineMetadata(key, metadata, descriptor.value)
          })
          Object.defineProperty(target.prototype, propertyName, descriptor)
        }
      }
    });
  }
}

// const createPipesRouteParamDecorator = (paramtype: RouteParamtypes) => (
//   data?: any,
//   ...pipes: (Type<PipeTransform> | PipeTransform)[]
// ): ParameterDecorator => (target, key, index) => {
//   const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
//   const hasParamData = isNil(data) || isString(data);
//   const paramData = hasParamData ? data : undefined;
//   const paramPipes = hasParamData ? pipes : [data, ...pipes];

//   Reflect.defineMetadata(
//     ROUTE_ARGS_METADATA,
//     assignMetadata(args, paramtype, index, paramData, ...paramPipes),
//     target.constructor,
//     key,
//   );
// };