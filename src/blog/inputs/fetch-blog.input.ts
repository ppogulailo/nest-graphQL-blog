import { Field, Int, ArgsType } from '@nestjs/graphql';
import { Max, Min } from 'class-validator';
enum DateSort {
  Asc = 'asc',
  Desc = 'desc',
}

@ArgsType()
export class FetchBlogInput {
  @Field(() => Int)
  @Min(0)
  skip = 0;

  @Field(() => Int)
  @Min(1)
  @Max(50)
  take = 25;
  @Field(() => String)
  title = '';
  @Field(() => DateSort)
  dateSort = DateSort.Asc;
}
