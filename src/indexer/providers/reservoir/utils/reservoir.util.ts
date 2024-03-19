import {
  Collection,
  SalesTx,
} from '../../common/interfaces/web3-provider.interface';
import { paths } from '@reservoir0x/reservoir-sdk';

export function toCollection(
  response: paths['/collections/v7']['get']['responses']['200']['schema'],
): Collection {
  const {
    id,
    slug,
    name,
    symbol,
    image,
    banner,
    discordUrl,
    twitterUsername,
    description,
    tokenCount,
    creator,
  } = response.collections[0];

  return {
    address: id,
    name,
    slug,
    symbol,
    tokenType: 'ERC721',
    totalSupply: parseInt(tokenCount, 10),
    description,
    contractDeployer: creator,
    imageUrl: image,
    bannerImageUrl: banner,
    social: {
      twitterUsername,
      discordUrl,
    },
  };
}

export function toSalesTxs(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  response: paths['/sales/v6']['get']['responses']['200']['schema'],
): SalesTx[] {
  return [];
}
