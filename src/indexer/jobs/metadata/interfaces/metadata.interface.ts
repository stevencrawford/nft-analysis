import { Nft } from 'alchemy-sdk';
import { NftAttributesResponse } from 'alchemy-sdk/dist/es/api/src/types/nft-types';

export type ContractJob = {
  contract: string;
};

export type ComputeRarityJob = {
  attributes: NftAttributesResponse;
  nfts: Nft[];
};
