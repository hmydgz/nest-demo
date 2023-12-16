import { Validate, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator'

/**
 * 自定义校验装饰器
 */
export const CustomValidate = <T>(
  cb: (value: T) => boolean | Promise<boolean>,
  message: string | ((args: ValidationArguments) => string) = '操作成功'
): PropertyDecorator => {
  return (target: object, propertyKey: string | symbol) => {

    @ValidatorConstraint()
    class _Validate implements ValidatorConstraintInterface {
      validate(value: T): boolean | Promise<boolean> { return cb(value) }
      defaultMessage(args: ValidationArguments): string {
        return typeof message === 'function'? message(args) : message
      }
    }

    Validate(_Validate)(target, propertyKey)
  }
}