import { Prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { IsArray, IsNotEmpty, IsString, Length } from "class-validator";
import { PermissionCodeEnum } from "src/common/enums/permission.enum";
import { CustomValidate } from "src/common/decorator/custom-validate.decorator";

const PermissionCodeEnumValueArr = Object.values(PermissionCodeEnum)

/**
 * 角色
 */
export class Role extends TimeStamps {
  /**
   * 名称
   */
  @Length(2, 10)
  @IsString()
  @IsNotEmpty()
  @Prop()
  name: string

  /**
   * 权限集合
   */
  @IsArray()
  @CustomValidate<PermissionCodeEnum[]>((val) => val.every(v => PermissionCodeEnumValueArr.includes(v)), 'test msg')
  @Prop()
  permissionCodeList: PermissionCodeEnum[]
}