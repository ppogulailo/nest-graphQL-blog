import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { BlogEntity } from '../blog/blog.entity';
import { BlogPostEntity } from "../blog-post/blog-post.entity";

export enum Roles {
  Moderator = 'Moderator',
  Writer = 'Writer',
}

@ObjectType()
@Entity('users')
export class UserEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;
  @Field()
  @CreateDateColumn()
  createdAt: Date;
  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
  @Field()
  @Column({ select: false })
  password: string;
  @Column()
  @Field(() => String, { description: 'first name of the user' })
  firstName: string;
  @Column()
  @Field(() => String, { description: 'last name of the user' })
  lastName: string;
  @Column()
  @Field(() => String, { description: 'email of the user' })
  email: string;
  @Column({ nullable: true })
  @Field(() => String, { description: 'refreshToken of the user' })
  refreshToken?: string;
  @Column({ default: Roles.Writer })
  @Field(() => String, { description: 'email of the user' })
  role: Roles;
  @OneToMany(() => BlogEntity, (blog) => blog.user)
  @Field(() => [BlogEntity], { nullable: true })
  blogs?: BlogEntity[];
  @OneToMany(() => BlogPostEntity, (blogPost) => blogPost.user)
  @Field(() => [BlogPostEntity], { nullable: true })
  blogPost?: BlogPostEntity[];
}
