import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { COLLECTION_METADATA } from '../constants/metadata.constant';
import { ContractJob } from '../interfaces/metadata.interface';
import { WorkerHostProcessor } from './worker-host.processor';
import { Logger } from '@nestjs/common';
import { ReservoirService } from '../../../providers/reservoir/services/reservoir.service';
import { CollectionMetadataResponse } from '../../../providers/reservoir/interfaces/reservoir.interface';
import { MetadataService } from '../services/metadata.service';

@Processor(COLLECTION_METADATA)
export class CollectionMetadataProcessor extends WorkerHostProcessor {
  readonly logger = new Logger(CollectionMetadataProcessor.name);

  constructor(
    private readonly reservoirService: ReservoirService,
    private readonly metadataService: MetadataService,
  ) {
    super();
  }

  async process(job: Job<ContractJob>): Promise<CollectionMetadataResponse> {
    const contractMetadata = await this.reservoirService.getContractMetadata(
      job.data.contract,
    );

    this.logger.log(`Contract Metadata for ${job.data.contract}:`);
    if (contractMetadata.collections[0]) {
      const contract = contractMetadata.collections[0];
      this.logger.log(`Symbol: ${contract.symbol}:`);
      this.logger.log(`Total Supply: ${contract.tokenCount}:`);

      await this.metadataService.addContract(
        `collections:${contract.id}:metadata`,
        {
          ...contract,
          raw: JSON.stringify(contract),
        },
      );
    }
    return contractMetadata;
  }
}
