import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { defaultJobOptions } from '../utils/default-job-options';
import { AlchemyModule } from '../../providers/alchemy/alchemy.module';
import { SALES, SALES_BACKFILL } from './constants/sales.constant';
import { SalesBackfillProcessor } from './processors/sales-backfill.processor';
import { ReservoirModule } from '../../providers/reservoir/reservoir.module';

@Module({
  imports: [
    ...[SALES_BACKFILL, SALES].map((queue) =>
      BullModule.registerQueue({
        name: queue,
        defaultJobOptions,
      }),
    ),
    AlchemyModule,
    ReservoirModule,
  ],
  controllers: [],
  providers: [SalesBackfillProcessor],
})
export class SalesModule {}
