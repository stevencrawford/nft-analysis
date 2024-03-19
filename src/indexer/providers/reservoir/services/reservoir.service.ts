import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { ReservoirConfig } from '../../../common/config/config';
import { RESERVOIR_BASE_URI } from '../constants/reservoir.constants';
import {
  Collection,
  SalesTx,
  Token,
  Traits,
  Web3Provider,
  WithoutRarity,
  WithRarity,
} from '../../common/interfaces/web3-provider.interface';
import { toCollection, toSalesTxs } from '../utils/reservoir.util';
import { paths } from '@reservoir0x/reservoir-sdk';

@Injectable()
export class ReservoirService implements Web3Provider {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getNftCollectionMetadata(contract: string): Promise<Collection> {
    const url = `${RESERVOIR_BASE_URI}/collections/v7`;
    const queryParams: paths['/collections/v7']['get']['parameters']['query'] =
      {
        id: contract,
        excludeNsfw: true,
        excludeSpam: true,
      };
    const response = await this.fetchWithApiKey<
      paths['/collections/v7']['get']['responses']['200']['schema']
    >(url, queryParams);

    if (response.collections[0]) {
      return toCollection(response);
    } else {
      throw new Error(`No collection found with id ${contract}`);
    }
  }

  async getNftCollectionTraits(
    collection: string,
    tokenSupply: number,
  ): Promise<Traits<WithRarity>> {
    const url =
      `${RESERVOIR_BASE_URI}/collections/:collection/attributes/explore/v5`.replace(
        ':collection',
        collection,
      );
    const queryParams: paths['/collections/{collection}/attributes/explore/v5']['get']['parameters']['query'] =
      {
        limit: 5000,
      };

    const response = await this.fetchWithApiKey<
      paths['/collections/{collection}/attributes/explore/v5']['get']['responses']['200']['schema']
    >(url, queryParams);
    const traits: Traits<WithRarity> = {};
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [_, attribute] of Object.entries(response.attributes)) {
      traits[`${attribute.key}`] ??= {};
      traits[`${attribute.key}`][`${attribute.value}`] = {
        count: attribute.tokenCount,
        rarity: attribute.tokenCount / tokenSupply,
      };
    }
    return traits;
  }

  async getNftTokens(collection: string): Promise<Token[]> {
    const url = `${RESERVOIR_BASE_URI}/tokens/v7`;
    const queryParams: paths['/tokens/v7']['get']['parameters']['query'] = {
      collection,
      includeAttributes: true,
      sortBy: 'updatedAt',
      limit: 1000,
    };
    const response = await this.fetchWithApiKeyAndContinuation<
      paths['/tokens/v7']['get']['responses']['200']['schema'],
      paths['/tokens/v7']['get']['responses']['200']['schema']['tokens']
    >('tokens', url, queryParams);

    const tokens: Token[] = [];
    const createTraits = <T extends { key?: string; value: string }[]>(
      attributes: T,
    ) => {
      const traits: Traits<WithoutRarity> = {};
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [_, trait] of Object.entries<{
        key?: string;
        value: string;
      }>(attributes)) {
        const { key, value } = trait;
        traits[key] = value;
      }
      return traits;
    };
    for (const nft of response) {
      const {
        tokenId,
        contract,
        imageLarge,
        imageSmall,
        metadata,
        attributes,
        kind,
      } = nft.token;
      tokens.push({
        tokenId,
        ...(metadata['tokenURI'] && {
          tokenUri: metadata['tokenURI'] as string,
        }),
        contract,
        tokenType: kind,
        image: {
          thumbnailUrl: imageSmall,
          ...(metadata['imageMimeType'] && {
            contentType: metadata['imageMimeType'] as string,
          }),
          imageUrl: imageLarge,
          ...(metadata['imageOriginal'] && {
            originalUrl: metadata['imageOriginal'] as string,
          }),
        },
        traits: createTraits(attributes),
        updatedAt: nft.updatedAt,
      });
    }
    tokens.sort((t1, t2) => t1.tokenId.localeCompare(t2.tokenId));
    return tokens;
  }

  async getNftSales(collection: string): Promise<SalesTx[]> {
    const url = `${RESERVOIR_BASE_URI}/sales/v6`;
    const queryParams: paths['/sales/v6']['get']['parameters']['query'] = {
      collection,
      limit: 1000,
    };
    const response = await this.fetchWithApiKey<
      paths['/sales/v6']['get']['responses']['200']['schema']
    >(url, queryParams);
    return toSalesTxs(response);
  }

  private async fetchWithApiKey<T>(url: string, params?: any): Promise<T> {
    const res = await firstValueFrom(
      this.httpService.get<T>(url, {
        params,
        headers: {
          RESERVOIR_API_KEY_HEADER:
            this.configService.getOrThrow<ReservoirConfig>('reservoir').apiKey,
        },
      }),
    );
    return res.data;
  }

  private async fetchWithApiKeyAndContinuation<
    T extends { continuation?: string },
    R extends any[],
  >(key: keyof T, url: string, params?: any, arr: R = [] as R): Promise<R> {
    const res: T = await this.fetchWithApiKey<T>(url, params);

    if (Array.isArray(res[key])) {
      arr.push(...res[String(key)]);
    } else {
      throw new Error(`Property ${String(key)} is not of type array.`);
    }

    if (res.continuation) {
      // If there is a continuation, recursively fetch the next page of results
      return this.fetchWithApiKeyAndContinuation<T, R>(
        key,
        url,
        { ...params, continuation: res.continuation },
        arr,
      );
    }

    return arr;
  }
}
