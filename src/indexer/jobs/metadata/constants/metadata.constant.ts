const metadataQueues = [
  'attribute-summary',
  'token-attributes',
  'compute-rarity',
  'collection-metadata',
  'metadata-refresh',
] as const;

const metadataFlows = ['metadata-producer'] as const;

export type MetadataQueues = (typeof metadataQueues)[number];

export const [
  ATTRIBUTE_SUMMARY,
  TOKEN_ATTRIBUTES,
  COMPUTE_RARITY,
  COLLECTION_METADATA,
  METADATA_REFRESH,
] = metadataQueues;

export const [METADATA_PRODUCER] = metadataFlows;
