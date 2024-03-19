import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  ATTRIBUTE_SUMMARY,
  COMPUTE_RARITY,
  MetadataQueues,
  TOKEN_ATTRIBUTES,
} from '../constants/metadata.constant';
import { WorkerHostProcessor } from './worker-host.processor';
import { Logger } from '@nestjs/common';
import { ContractJob } from '../interfaces/metadata.interface';
import {
  Token,
  Traits,
  WithRarity,
} from '../../../providers/common/interfaces/web3-provider.interface';

@Processor(COMPUTE_RARITY)
export class ComputeRarityProcessor extends WorkerHostProcessor {
  readonly logger = new Logger(ComputeRarityProcessor.name);

  async process(job: Job<ContractJob, any, string>): Promise<any> {
    const results = await job.getChildrenValues<Token[] | Traits<WithRarity>>();

    const partialKeyMatcher = (partialKey: MetadataQueues) =>
      Object.keys(results).find((key) => key.includes(partialKey));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const attributes = results[
      partialKeyMatcher(ATTRIBUTE_SUMMARY)
    ] as Traits<WithRarity>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const nfts = results[partialKeyMatcher(TOKEN_ATTRIBUTES)] as Token[];

    return {};
  }
}
