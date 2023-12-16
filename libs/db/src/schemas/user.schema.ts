import { Prop, Ref, modelOptions, mongoose } from '@typegoose/typegoose'
import { Role } from './role.schema'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { IsString, Length, MaxLength } from 'class-validator'

/**
 * 用户
 */
@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
export class User extends TimeStamps {
  /**
   * 用户名
   */
  @MaxLength(64)
  @IsString()
  @Prop()
  username: string

  /**
   * 密码
   */
  @Length(6, 16)
  @IsString()
  @Prop({ select: false })
  password: string

  /**
   * 角色ID
   */
  @IsString()
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