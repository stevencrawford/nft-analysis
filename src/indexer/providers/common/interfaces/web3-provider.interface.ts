export interface Collection {
  address: string;
  name?: string;
  slug: string;
  symbol?: string;
  totalSupply: number;
  tokenType: 'ERC721' | 'ERC1155';
  contractDeployer?: string;
  deployedBlockNumber?: number;
  imageUrl: string;
  bannerImageUrl: string;
  description: string;
  social: {
    twitterUsername: string;
    discordUrl: string;
  };
}

export interface WithRarity {
  [value: string]: {
    count: number;
    rarity: number;
  };
}
export type WithoutRarity = string;

export interface Traits<T> {
  [trait: string]: T;
}

export interface Token {
  tokenId: string;
  tokenType: string;
  contract: string;
  tokenUri?: string;
  image: {
    imageUrl: string;
    thumbnailUrl?: string;
    originalUrl?: string;
    contentType?: string;
  };
  traits: Traits<WithoutRarity>;
  owner?: string;
  supply?: string;
  remainingSupply?: string;
  rarity?: string;
  rarityRank?: string;
  updatedAt: string;
}

export interface SalesTx {
  marketplace: string;
  contractAddress: string;
  tokenId: number;
  quantity: number;
  buyerAddress: string;
  sellerAddress: string;
  sellerFee: {
    amount: number;
    tokenAddress?: string;
    symbol?: string;
    decimals?: number;
  };
  blockNumber: number;
  transactionHash: string;
}

export interface Web3Provider {
  getNftCollectionMetadata(collection: string): Promise<Collection>;

  getNftSales(collection: string, fromBlock?: number): Promise<SalesTx[]>;

  getNftCollectionTraits(
    collection: string,
    tokenSupply: number,
  ): Promise<Traits<WithRarity>>;

  getNftTokens(collection: string): Promise<Token[]>;
}
