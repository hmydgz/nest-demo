import { Prop, Ref, modelOptions, mongoose } from '@typegoose/typegoose'
import { Role } from './role.schema'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { IsString, Length } from 'class-validator'

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
export class User extends TimeStamps {
  // @Length(4, 100)
  @IsString()
  @Prop()
  username: string

  @Length(6, 16)
  @IsString()
  @Prop({ select: false })
  password: string

  @Prop()
  roleId?: mongoose.Types.ObjectId

  @Prop({
    localField: 'roleId',
    foreignField: '_id',
    ref: () => Role,
    justOne: true,
  })
  role?: Ref<Role, string>
}