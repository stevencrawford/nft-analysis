import { Injectable } from '@nestjs/common';
import { FlowChildJob, FlowProducer } from 'bullmq';
import { InjectMetadataProducer } from '../decorators/metadata-producer.decorator';
import {
  ATTRIBUTE_SUMMARY,
  COLLECTION_METADATA,
  METADATA_REFRESH,
  TOKEN_ATTRIBUTES,
} from '../constants/metadata.constant';
import { InjectRedis } from '@songkeys/nestjs-redis';
import Redis from 'ioredis';

@Injectable()
export class MetadataService {
  constructor(
    @InjectMetadataProducer() private metadataFlowProducer: FlowProducer,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async refreshMetadata(contract: string) {
    const data = { contract };

    const createChild = (
      queue: string,
      data: Record<string, any>,
      children?: FlowChildJob[],
    ): FlowChildJob => {
      return {
        name: `${queue}-${contract}`,
        data,
        children,
        queueName: queue,
      };
    };

    const flow = await this.metadataFlowProducer.add({
      name: `metadata-${contract}`,
      data,
      queueName: METADATA_REFRESH,
      children: [
        createChild(ATTRIBUTE_SUMMARY, data, [
          createChild(COLLECTION_METADATA, data),
        ]),
        createChild(TOKEN_ATTRIBUTES, data),
      ],
      opts: {
        failParentOnFailure: true,
      },
    });
    return flow.job.id || '';
  }

  async addContract(key: string, data: any) {
    await this.redis.hset(key, data);
  }
}
