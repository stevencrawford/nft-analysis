import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { COLLECTION_METADATA } from '../constants/metadata.constant';
import { ContractJob } from '../interfaces/metadata.interface';
import { WorkerHostProcessor } from './worker-host.processor';
import { Logger } from '@nestjs/common';
import { ReservoirService } from '../../../providers/reservoir/services/reservoir.service';
import { MetadataService } from '../services/metadata.service';
import { Collection } from '../../../providers/common/interfaces/web3-provider.interface';

@Processor(COLLECTION_METADATA)
export class CollectionMetadataProcessor extends WorkerHostProcessor {
  readonly logger = new Logger(CollectionMetadataProcessor.name);

  constructor(
    private readonly reservoirService: ReservoirService,
    private readonly metadataService: MetadataService,
  ) {
    super();
  }

  async process(job: Job<ContractJob>): Promise<Collection> {
    const contractMetadata =
      await this.reservoirService.getNftCollectionMetadata(job.data.contract);

    this.logger.log(`Contract Metadata for ${job.data.contract}:`);
    if (contractMetadata) {
      this.logger.log(`Symbol: ${contractMetadata.symbol}`);
      this.logger.log(`Total Supply: ${contractMetadata.totalSupply}:`);

      await this.metadataService.addContract(
        `collections:${contractMetadata.address}:metadata`,
        {
          ...contractMetadata,
          raw: JSON.stringify(contractMetadata),
        },
      );
    }
    return contractMetadata;
  }
}
