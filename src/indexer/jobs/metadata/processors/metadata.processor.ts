import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { METADATA_REFRESH } from '../constants/metadata.constant';
import { ContractJob } from '../interfaces/metadata.interface';
import { WorkerHostProcessor } from './worker-host.processor';
import { Logger } from '@nestjs/common';

@Processor(METADATA_REFRESH)
export class MetadataRefreshProcessor extends WorkerHostProcessor {
  readonly logger = new Logger(MetadataRefreshProcessor.name);

  async process(job: Job<ContractJob>): Promise<any> {
    this.logger.log(
      `Finished refreshing metadata for contract ${job.data.contract}`,
    );
  }
}
