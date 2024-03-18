import { Logger } from '@nestjs/common';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ContractJob } from '../../metadata/interfaces/metadata.interface';
import { ReservoirService } from '../../../providers/reservoir/services/reservoir.service';

@Processor('sales-history')
export class SalesHistoryProcessor extends WorkerHost {
  private readonly logger = new Logger(SalesHistoryProcessor.name);

  constructor(private readonly reservoirService: ReservoirService) {
    super();
  }

  async process(job: Job<any>) {
    this.logger.debug(JSON.stringify(job));
  }

  @OnWorkerEvent('error')
  onError(err: Error): void {
    this.logger.error('Error in worker');
    console.error(err);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<ContractJob>, err: Error): void {
    this.logger.warn(`Failed job ${job.id}: ${err.message}`);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<ContractJob>): void {
    this.logger.log(`Completed job ${job.id}`);
  }
}
