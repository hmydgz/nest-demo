import { Prop, Ref, modelOptions, mongoose } from '@typegoose/typegoose'
import { Role } from './role.schema'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { IsString, Length, MaxLength } from 'class-validator'

/**
 * 用户
 */
@modelOptions({
  schemaOptions: {
    id: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
export class User extends TimeStamps {
  @Prop({ select: false })
  __v?: number;

  /**
   * 用户名
   */
  @MaxLength(64, { message: '用户名长度不能超过64' })
  @IsString({ message: '用户名必须是字符串' })
  @Prop()
  username: string

  /**
   * 密码
   */
  @Length(6, 16, { message: '密码长度必须在6-16之间' })
  @IsString({ message: '密码必须是字符串' })
  @Prop({ select: false })
  password: string

  /**
   * 角色ID
   */
  @Prop()
  roleId?: mongoose.Types.ObjectId

  /**
   * 角色对象
   */
  @Prop({
    localField: 'roleId',
    foreignField: '_id',
    ref: () => Role,
    justOne: true,
  })
  role?: Ref<Role, string>
}