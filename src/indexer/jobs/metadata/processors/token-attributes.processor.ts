import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TOKEN_ATTRIBUTES } from '../constants/metadata.constant';
import { AlchemyService } from '../../../providers/alchemy/services/alchemy.service';
import { ContractJob } from '../interfaces/metadata.interface';
import { WorkerHostProcessor } from './worker-host.processor';
import { Logger } from '@nestjs/common';

@Processor(TOKEN_ATTRIBUTES)
export class TokenAttributesProcessor extends WorkerHostProcessor {
  readonly logger = new Logger(TokenAttributesProcessor.name);

  constructor(private readonly alchemyService: AlchemyService) {
    super();
  }

  async process(job: Job<ContractJob>): Promise<any> {
    return await this.alchemyService.getNftsForContract(job.data.contract);
  }
}
