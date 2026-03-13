import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UserModule } from './features/user/user.module';
import { PlaylistModule } from './features/playlist/playlist.module';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './infrastructure/database/mikroOrm.config';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './features/auth/auth.module';
import { AppController } from './app.controller';
import { ChatModule } from './features/chat/chat.module';
import { AiModule } from './infrastructure/ai/ai.module';
import { VideoModule } from './features/video/video.module';
import GraphQLJSON from 'graphql-type-json';
import { SearcherModule } from './infrastructure/ai/claude/tools/searcher/searcher.module';
import { MessageModule } from './features/message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MikroOrmModule.forRoot({
      ...mikroOrmConfig, //autoLoadEntities: true
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      resolvers: { JSON: GraphQLJSON },
    }),
    PlaylistModule,
    AuthModule,
    UserModule,
    ChatModule,
    SearcherModule,
    AiModule,
    MessageModule,
    VideoModule
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
