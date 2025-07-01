import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OpenAIModule } from './openai/openai.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { ArtworksModule } from './artworks/artworks.module';
import { ConversationsModule } from './conversations/conversations.module';
import { MessagesModule } from './messages/messages.module';
import { ResultsModule } from './results/results.module';
import { TipsModule } from './tips/tips.module';
import { LevelsModule } from './levels/levels.module';
@Module({
  imports: [
    // nest.js 설정
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.development.local', '.env.development'],
      isGlobal: true, // 전역 모듈 선언
    }),
    // typeorm 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        schema: 'artalker',
        // entities: [User],
        autoLoadEntities: true,

        // synchronize true 값을 주면 앱을 실행할 때 entity에서 컬럼 수정사항이 있다면,
        // 해당 테이블을 drop한 후 다시 생성한다.
        // TODO: 배포 환경에서는 false 설정해야 한다.
        synchronize: true,
        logging: true,
        logger: 'advanced-console',

        // timezone
        timezone: 'Asia/Seoul',
      }),
      inject: [ConfigService],
    }),
    // modules
    OpenAIModule,
    AuthModule,
    UsersModule,
    ArtworksModule,
    ConversationsModule,
    MessagesModule,
    ResultsModule,
    TipsModule,
    LevelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
