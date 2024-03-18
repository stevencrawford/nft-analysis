import { InjectFlowProducer } from '@nestjs/bullmq';
import { METADATA_PRODUCER } from '../constants/metadata.constant';

export const InjectMetadataProducer = () =>
  InjectFlowProducer(METADATA_PRODUCER);
