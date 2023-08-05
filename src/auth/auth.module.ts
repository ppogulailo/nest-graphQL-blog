import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/users/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/accessToken.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Import ConfigService
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from 'src/users/user.service';
import { UserEntity } from '../users/user.entity';

@Module({
  imports: [
    JwtModule.register({}),
    UserModule,
    ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [
    AuthService,
    AccessTokenStrategy,
    UserService,
    AuthResolver,
    JwtService,
  ],
  exports: [AuthService, JwtService],
})
export class AuthModule {}