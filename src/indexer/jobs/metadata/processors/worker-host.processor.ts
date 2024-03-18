import { OnWorkerEvent, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ContractJob } from '../interfaces/metadata.interface';
import { Logger } from '@nestjs/common';

export abstract class WorkerHostProcessor extends WorkerHost {
  protected readonly logger = new Logger(WorkerHostProcessor.name);

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
