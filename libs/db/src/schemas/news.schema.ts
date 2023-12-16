import { Prop } from '@typegoose/typegoose'
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses'
import { IsNotEmpty, IsString, Length } from 'class-validator'

export class News extends TimeStamps {
  @Length(4, 10)
  @IsString()
  @IsNotEmpty()
  @Prop()
  title: string

  @Prop()
  content: string
}