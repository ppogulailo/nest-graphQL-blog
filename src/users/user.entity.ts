import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
enum Roles {
  Moderator,
  Writer,
}

@ObjectType()
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String, { description: 'id of the user' })
  userId: string;
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
  @Field(() => Roles, { description: 'role of the user' })
  role: Roles;
}
