import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../users/user.entity';
import { BlogEntity } from "../blog/blog.entity";

@ObjectType()
@Entity('blog-post')
export class BlogPostEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @CreateDateColumn()
  createdAt: Date;
  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({unique:true})
  @Field(() => String, { description: 'title of the blog-post' })
  title: string;
  @Column()
  @Field(() => String, { description: 'message of the blog-post' })
  message: string;
  @ManyToOne(() => UserEntity, (user) => user.blogPost, { cascade: true })
  @Field(() => UserEntity)
  user: UserEntity;
  @ManyToOne(() => BlogEntity, (blog) => blog.blogPost, { cascade: true })
  @Field(() => BlogEntity)
  blog: BlogEntity;
}
