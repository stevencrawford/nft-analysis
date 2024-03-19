import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { SALES } from '../constants/sales.constant';
import { ReservoirService } from '../../../providers/reservoir/services/reservoir.service';

@Processor(SALES)
export class SalesProcessor extends WorkerHost {
  readonly logger = new Logger(SalesProcessor.name);

  constructor(private readonly reservoirService: ReservoirService) {
    super();
  }

  async process(job: Job<{ contract: string }>): Promise<any> {
    return await this.reservoirService.getNftSales(job.data.contract);
  }
}
