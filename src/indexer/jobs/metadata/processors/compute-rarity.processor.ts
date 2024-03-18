import { Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import {
  ATTRIBUTE_SUMMARY,
  COMPUTE_RARITY,
  TOKEN_ATTRIBUTES,
} from '../constants/metadata.constant';
import { WorkerHostProcessor } from './worker-host.processor';
import { Logger } from '@nestjs/common';
import { NftAttributesResponse } from 'alchemy-sdk/dist/es/api/src/types/nft-types';
import { Nft } from 'alchemy-sdk';
import { ContractJob } from '../interfaces/metadata.interface';

@Processor(COMPUTE_RARITY)
export class ComputeRarityProcessor extends WorkerHostProcessor {
  readonly logger = new Logger(ComputeRarityProcessor.name);

  async process(job: Job<ContractJob, any, string>): Promise<any> {
    const results = await job.getChildrenValues<
      Nft[] | NftAttributesResponse
    >();

    const partialKeyMatcher = (
      partialKey: typeof ATTRIBUTE_SUMMARY | typeof TOKEN_ATTRIBUTES,
    ) => Object.keys(results).find((key) => key.includes(partialKey));

    const attributes = results[
      partialKeyMatcher(ATTRIBUTE_SUMMARY)
    ] as NftAttributesResponse;
    const nfts = results[partialKeyMatcher(TOKEN_ATTRIBUTES)] as Nft[];

    type AttributeRarity = {
      count: number;
      rarity: number;
    };

    const attributesMap = new Map<string, AttributeRarity>();
    for (const [attribute, values] of Object.entries(attributes.summary)) {
      for (const [value, count] of Object.entries(values)) {
        attributesMap.set(`${attribute}.${value}`, {
          count,
          rarity: count / nfts.length,
        });
      }
    }

    return attributesMap;
  }
}
