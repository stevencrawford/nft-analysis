import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  ATTRIBUTE_SUMMARY,
  COLLECTION_METADATA,
  MetadataQueues,
} from '../constants/metadata.constant';
import { AlchemyService } from '../../../providers/alchemy/services/alchemy.service';
import { ContractJob } from '../interfaces/metadata.interface';
import { WorkerHostProcessor } from './worker-host.processor';
import { Logger } from '@nestjs/common';
import { Collection } from '../../../providers/common/interfaces/web3-provider.interface';

@Processor(ATTRIBUTE_SUMMARY)
export class AttributeSummaryProcessor extends WorkerHostProcessor {
  readonly logger = new Logger(AttributeSummaryProcessor.name);

  constructor(private readonly alchemyService: AlchemyService) {
    super();
  }

  async process(job: Job<ContractJob>): Promise<any> {
    const results = await job.getChildrenValues<Collection>();

    const partialKeyMatcher = (partialKey: MetadataQueues) =>
      Object.keys(results).find((key) => key.includes(partialKey));

    const collection = results[partialKeyMatcher(COLLECTION_METADATA)];

    const traits = await this.alchemyService.getNftCollectionTraits(
      job.data.contract,
      collection.totalSupply,
    );
    this.logger.log(traits);
    return traits;
  }
}
