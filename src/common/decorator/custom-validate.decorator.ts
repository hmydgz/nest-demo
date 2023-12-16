import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

/**
 * 自定义校验装饰器
 */
export const CustomValidate = <T>(
  cb: (value: T, args: ValidationArguments) => boolean | Promise<boolean>,
  message: string | ((args: ValidationArguments) => string) = '操作失败'
): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {

    @ValidatorConstraint()
    class _Validate implements ValidatorConstraintInterface {
      validate(value: T, args: ValidationArguments): boolean | Promise<boolean> { return cb(value, args) }
      defaultMessage(args: ValidationArguments): string {
        return typeof message === 'function' ? message(args) : message
      }
    }

    Validate(_Validate)(target, propertyKey)
  }
}

/**
 * 枚举校验装饰器
 */
export const CheckEnum = <T>(enumObj: T, message: string | ((args: ValidationArguments) => string) = '操作失败') => {
  return (target: object, propertyKey: string | symbol) => {
    const values = Object.values(enumObj)
    @ValidatorConstraint()
    class _Validate implements ValidatorConstraintInterface {
      validate(value: T): boolean | Promise<boolean> {
        return values.includes(value)
      }
      defaultMessage(args: ValidationArguments): string {
        return typeof message === 'function' ? message(args) : message
      }
    }

    Validate(_Validate)(target, propertyKey)
  }
}