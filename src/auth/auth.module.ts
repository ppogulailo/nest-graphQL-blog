import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/users/user.service';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [
    JwtModule.register({}),
    UsersModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [AuthService, AccessTokenStrategy, UserService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
