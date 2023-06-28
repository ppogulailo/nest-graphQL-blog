import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../.env' }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('TYPE_ORM_HOST'),
        port: config.get('TYPE_ORM_PORT'),
        username: config.get('TYPE_ORM_USERNAME'),
        password: config.get('TYPE_ORM_PASS'),
        database: config.get('TYPE_ORM_DATABASE'),
        entities: [__dirname + 'dist/**/*.entity{.ts,.js}'],
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
  ],
})
export class AppModule {}
