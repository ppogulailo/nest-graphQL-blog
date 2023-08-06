import { Field, InputType } from '@nestjs/graphql';
import {IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {EMAIL_VALIDATION_MESSAGE} from "../../common/const/global";
import {Roles} from "../user.entity";

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({},{message:EMAIL_VALIDATION_MESSAGE})
  email: string;
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  firstName: string;
  @Field({ nullable: true })
  @IsString()
  @IsNotEmpty()
  lastName: string;
  @Field()
  @IsNotEmpty()
  password: string;
  @Field()
  @IsOptional()
  @IsEnum(Roles)
  role?: Roles;
}
