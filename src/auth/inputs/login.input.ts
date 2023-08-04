import {IsEmail, IsNotEmpty, IsString, MinLength} from 'class-validator';
import {Field, InputType} from "@nestjs/graphql";
import {EMAIL_VALIDATION_MESSAGE} from "../../common/const/global";

@InputType()
export class LoginInput {
    @Field()
    @IsEmail({},{message:EMAIL_VALIDATION_MESSAGE})
    email: string;
    @Field()
    @IsNotEmpty()
    password: string;
}
