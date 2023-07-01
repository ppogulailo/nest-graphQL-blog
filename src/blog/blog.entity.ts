import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from '../users/user.entity';

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
  @Column()
  @Field(() => String, { description: 'name of the blog' })
  name: string;
  @ManyToOne(() => UserEntity, (user) => user.blogs, { cascade: true })
  @Field(() => UserEntity)
  user: UserEntity;
}
