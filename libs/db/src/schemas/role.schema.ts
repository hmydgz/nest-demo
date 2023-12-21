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
  @Length(2, 10, { message: '名称长度必须在2-10之间' })
  @IsString({ message: '名称必须是字符串' })
  @IsNotEmpty({ message: '名称不能为空' })
  @Prop()
  name: string

  /**
   * 权限集合
   */
  @IsArray({ message: '权限集合必须是数组' })
  @CustomValidate<PermissionCodeEnum[]>((val) => val.every(v => PermissionCodeEnumValueArr.includes(v)), '非法权限')
  @Prop()
  permissionCodeList: PermissionCodeEnum[]
}