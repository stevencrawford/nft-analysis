import { Module } from '@nestjs/common';
import { RedisModule } from '@songkeys/nestjs-redis';
import { BullModule } from '@nestjs/bullmq';
import { SalesHistoryModule } from './jobs/sales-history/sales-history.module';
import { MetadataModule } from './jobs/metadata/metadata.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config, { Config, RedisConfig } from './common/config/config';
import { configSchema } from './common/config/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
      validate: (env) => configSchema.parse(env),
    }),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const redisConfig = configService.getOrThrow<RedisConfig>('redis');
        return {
          readyLog: true,
          config: {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
            keyPrefix: redisConfig.keyPrefix + ':',
          },
        };
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Config>) => {
        const redisConfig = configService.getOrThrow<RedisConfig>('redis');
        return {
          prefix: redisConfig.keyPrefix + ':indexer:bullmq',
          connection: {
            host: redisConfig.host,
            port: redisConfig.port,
            password: redisConfig.password,
            db: redisConfig.db,
          },
        };
      },
    }),
    MetadataModule,
  ],
})
export class AppModule {}
