import { Field, Int, ArgsType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
enum DateSort {
  Asc = 'asc',
  Desc = 'desc',
}

@ArgsType()
export class FetchBlogPostInput {
  @Field(() => Int)
  @Min(0)
  skip = 0;
  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;
  @Field(() => String)
  title = '';
  @Field(() => Number)
  id;
  @Field(() => DateSort)
  dateSort = DateSort.Asc;
}
