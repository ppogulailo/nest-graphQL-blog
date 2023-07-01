import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import * as process from 'process';
import { BlogModule } from './blog/blog.module';
import { BlogPostModule } from './blog-post/blog-post.module';
import { APP_GUARD } from '@nestjs/core';
import { graphqlContextGetToken } from './common/guards/auth.guard';
import { UserService } from "./users/user.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: process.env.TYPE_ORM_HOST,
        port: 5432,
        username: process.env.TYPE_ORM_USERNAME,
        password: process.env.TYPE_ORM_PASS,
        database: process.env.TYPE_ORM_DATABASE,
        entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
    UserModule,
    AuthModule,
    BlogModule,
    BlogPostModule,
  ],
  providers: [

    {
      provide: APP_GUARD,
      useClass: graphqlContextGetToken,
    },
  ],
})
export class AppModule {}
