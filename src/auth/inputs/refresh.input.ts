import { Field, InputType } from '@nestjs/graphql';
import {IsNumber, IsString} from "class-validator";

@InputType()
export class RefreshInput {
  @Field()
  @IsString()
  refresh_token: string;
  @Field()
  @IsString()
  access_token: string;
  @Field()
  @IsNumber()
  id: number;
}
