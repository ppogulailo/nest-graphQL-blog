import { Field, InputType } from '@nestjs/graphql';
import {IsEmail, IsNotEmpty, IsString} from "class-validator";
import {EMAIL_VALIDATION_MESSAGE} from "../../common/const/global";

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({},{message:EMAIL_VALIDATION_MESSAGE})
  email: string;
  @Field({ nullable: true })
  @IsString()
  firstName: string;
  @Field({ nullable: true })
  @IsString()
  lastName: string;
  @Field()
  @IsNotEmpty()
  password: string;
}
