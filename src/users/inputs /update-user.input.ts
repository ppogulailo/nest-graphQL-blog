import { InputType, Field, ID } from '@nestjs/graphql';
import {IsEmail, IsNumber, IsOptional, IsString} from 'class-validator';
import {EMAIL_VALIDATION_MESSAGE} from "../../common/const/global";

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  @IsNumber()
  id: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  lastName?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEmail({},{message:EMAIL_VALIDATION_MESSAGE})
  email?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  refreshToken?: string;
}