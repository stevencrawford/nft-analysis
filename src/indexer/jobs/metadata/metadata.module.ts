import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { defaultJobOptions } from '../../common/utils/default-job-options';
import { MetadataService } from './services/metadata.service';
import { MetadataController } from './controllers/metadata.controller';
import { ProvidersModule } from '../../providers/providers.module';
import { AttributeSummaryProcessor } from './processors/attribute-summary.processor';
import { ComputeRarityProcessor } from './processors/compute-rarity.processor';
import { CollectionMetadataProcessor } from './processors/collection-metadata.processor';
import { TokenAttributesProcessor } from './processors/token-attributes.processor';
import {
  ATTRIBUTE_SUMMARY,
  COLLECTION_METADATA,
  COMPUTE_RARITY,
  METADATA_PRODUCER,
  TOKEN_ATTRIBUTES,
} from './constants/metadata.constant';

@Module({
  imports: [
    ...[
      COLLECTION_METADATA,
      COMPUTE_RARITY,
      ATTRIBUTE_SUMMARY,
      TOKEN_ATTRIBUTES,
    ].map((queue) =>
      BullModule.registerQueue({
        name: queue,
        defaultJobOptions,
      }),
    ),
    BullModule.registerFlowProducer({
      name: METADATA_PRODUCER,
    }),
    ProvidersModule,
  ],
  providers: [
    CollectionMetadataProcessor,
    AttributeSummaryProcessor,
    TokenAttributesProcessor,
    ComputeRarityProcessor,
    MetadataService,
  ],
  controllers: [MetadataController],
})
export class MetadataModule {}
