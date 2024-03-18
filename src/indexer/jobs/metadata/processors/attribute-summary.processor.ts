import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ATTRIBUTE_SUMMARY } from '../constants/metadata.constant';
import { AlchemyService } from '../../../providers/alchemy/services/alchemy.service';
import { ContractJob } from '../interfaces/metadata.interface';
import { WorkerHostProcessor } from './worker-host.processor';
import { Logger } from '@nestjs/common';

@Processor(ATTRIBUTE_SUMMARY)
export class AttributeSummaryProcessor extends WorkerHostProcessor {
  readonly logger = new Logger(AttributeSummaryProcessor.name);

  constructor(private readonly alchemyService: AlchemyService) {
    super();
  }

  async process(job: Job<ContractJob>): Promise<any> {
    return await this.alchemyService.summarizeNFTAttributes(job.data.contract);
  }
}
