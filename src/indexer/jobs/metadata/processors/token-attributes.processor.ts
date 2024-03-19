import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { TOKEN_ATTRIBUTES } from '../constants/metadata.constant';
import { AlchemyService } from '../../../providers/alchemy/services/alchemy.service';
import { ContractJob } from '../interfaces/metadata.interface';
import { WorkerHostProcessor } from './worker-host.processor';
import { Logger } from '@nestjs/common';
import { Token } from '../../../providers/common/interfaces/web3-provider.interface';
import { ReservoirService } from '../../../providers/reservoir/services/reservoir.service';

@Processor(TOKEN_ATTRIBUTES)
export class TokenAttributesProcessor extends WorkerHostProcessor {
  readonly logger = new Logger(TokenAttributesProcessor.name);

  constructor(
    private readonly alchemyService: AlchemyService,
    private readonly reservoirService: ReservoirService,
  ) {
    super();
  }

  async process(job: Job<ContractJob>): Promise<Token[]> {
    // const tokens = await this.alchemyService.getNftTokens(job.data.contract);
    const tokens = await this.reservoirService.getNftTokens(job.data.contract);
    this.logger.log(`Tokens found: ${tokens.length}`);
    this.logger.log(tokens[0]);
    this.logger.log(tokens[tokens.length - 1]);
    return tokens;
  }
}
