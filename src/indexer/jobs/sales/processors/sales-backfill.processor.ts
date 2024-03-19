import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { AlchemyService } from '../../../providers/alchemy/services/alchemy.service';
import { Logger } from '@nestjs/common';
import { SALES_BACKFILL } from '../constants/sales.constant';

@Processor(SALES_BACKFILL)
export class SalesBackfillProcessor extends WorkerHost {
  readonly logger = new Logger(SalesBackfillProcessor.name);

  constructor(private readonly alchemyService: AlchemyService) {
    super();
  }

  async process(job: Job<{ contract: string }>): Promise<any> {
    return await this.alchemyService.getNftSales(job.data.contract);
  }
}
