import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../users/user.entity';
import { BlogPostEntity } from '../blog-post/blog-post.entity';

@ObjectType()
@Entity('blog')
export class BlogEntity {
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
  @Field(() => String, { description: 'name of the blog' })
  name: string;
  @ManyToOne(() => UserEntity, (user) => user.blogs, { cascade: true })
  @Field(() => UserEntity)
  user: UserEntity;
  @OneToMany(() => BlogPostEntity, (blogPost) => blogPost.blog)
  @Field(() => [BlogPostEntity], { nullable: true })
  blogPost?: BlogPostEntity[];
}
