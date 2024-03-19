import {
  Collection,
  SalesTx,
  Token,
  Traits,
  WithoutRarity,
} from '../../common/interfaces/web3-provider.interface';
import { GetNftSalesResponse, Nft, NftContract } from 'alchemy-sdk';

export function toCollection(contract: NftContract): Collection {
  const {
    name,
    address,
    symbol,
    contractDeployer,
    totalSupply,
    openSeaMetadata: {
      collectionSlug,
      description,
      bannerImageUrl,
      imageUrl,
      discordUrl,
      twitterUsername,
    },
  } = contract;

  return {
    name,
    address,
    symbol,
    contractDeployer,
    slug: collectionSlug,
    tokenType: 'ERC721',
    totalSupply: parseInt(totalSupply, 10),
    description,
    imageUrl,
    bannerImageUrl,
    social: {
      twitterUsername,
      discordUrl,
    },
  };
}

export function toSalesTxs(response: GetNftSalesResponse): SalesTx[] {
  return response.nftSales.map((nftSale) => {
    const {
      marketplace,
      contractAddress,
      buyerAddress,
      sellerAddress,
      transactionHash,
      blockNumber,
      quantity,
      sellerFee,
      tokenId,
    } = nftSale;
    return {
      tokenId: parseInt(tokenId, 10),
      marketplace,
      contractAddress,
      quantity: parseInt(quantity, 10),
      buyerAddress,
      sellerAddress,
      sellerFee: {
        ...sellerFee,
        amount: parseInt(sellerFee.amount, 10),
      },
      transactionHash,
      blockNumber,
    };
  });
}

export function toToken(nft: Nft): Token {
  const { tokenId, tokenType, tokenUri, contract, image, raw } = nft;
  const { thumbnailUrl, originalUrl, contentType } = image;
  const createTraits = () => {
    const traits: Traits<WithoutRarity> = {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, trait] of Object.entries<{
      value: string;
      trait_type: string;
    }>(raw.metadata['attributes'])) {
      const { trait_type, value } = trait;
      traits[trait_type] = value;
    }
    return traits;
  };
  return {
    tokenId,
    tokenType,
    tokenUri,
    contract: contract.address,
    image: {
      imageUrl: image.pngUrl,
      thumbnailUrl,
      originalUrl,
      contentType,
    },
    traits: createTraits(),
    updatedAt: nft.timeLastUpdated,
  };
}
