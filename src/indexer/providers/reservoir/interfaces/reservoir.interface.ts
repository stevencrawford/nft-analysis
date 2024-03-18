import { paths } from '@reservoir0x/reservoir-sdk';

export type AttributeStatsResponse =
  paths['/collections/{collection}/attributes/explore/v5']['get']['responses']['200']['schema'];

export type AllAttributeResponse =
  paths['/collections/{collection}/attributes/all/v4']['get']['responses']['200']['schema'];

export type CollectionMetadataResponse =
  paths['/collections/v7']['get']['responses']['200']['schema'];

export type CollectionMetadataQueryParams =
  paths['/collections/v7']['get']['parameters']['query'];

export type TokensResponse =
  paths['/tokens/v7']['get']['responses']['200']['schema'];

export type TokensQueryParams =
  paths['/tokens/v7']['get']['parameters']['query'];

export type PaginatedResponse = {
  continuation?: string;
};
