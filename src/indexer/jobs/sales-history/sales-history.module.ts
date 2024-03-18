import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { SalesHistoryProcessor } from './processors/sales-history.processor';
import { defaultJobOptions } from '../../common/utils/default-job-options';
import { AlchemyModule } from '../../providers/alchemy/alchemy.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'sales-history',
      defaultJobOptions,
    }),
    AlchemyModule,
  ],
  controllers: [],
  providers: [SalesHistoryProcessor],
})
export class SalesHistoryModule {}
