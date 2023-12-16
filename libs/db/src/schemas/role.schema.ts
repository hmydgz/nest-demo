import { Prop } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { IsArray, IsNotEmpty, IsString, Length } from "class-validator";
import { PermissionCodeEnum } from "src/config/permission";
import { CustomValidate } from "src/decorator/custom-validate.decorator";

const PermissionCodeEnumValueArr = Object.values(PermissionCodeEnum)

export class Role extends TimeStamps {
  @Length(2, 10)
  @IsString()
  @IsNotEmpty()
  @Prop()
  name: string

  @IsArray()
  @CustomValidate<PermissionCodeEnum[]>((val) => val.every(v => PermissionCodeEnumValueArr.includes(v)), 'test msg')
  @Prop()
  permissionCodeList: PermissionCodeEnum[]
}