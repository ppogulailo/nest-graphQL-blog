import { Field, ID, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
  @Field(() => ID)
  id: number;

  @Field({ nullable: true })
  refreshToken: string;
}
