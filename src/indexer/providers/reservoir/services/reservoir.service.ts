import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  AllAttributeResponse,
  AttributeStatsResponse, CollectionMetadataQueryParams, CollectionMetadataResponse,
  TokensQueryParams,
  TokensResponse,
} from '../interfaces/reservoir.interface';
import { ReservoirConfig } from '../../../common/config/config';
import { RESERVOIR_BASE_URI } from '../constants/reservoir.constants';

@Injectable()
export class ReservoirService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async getAllAttributes(collection: string): Promise<AllAttributeResponse> {
    const url =
      `${RESERVOIR_BASE_URI}/collections/:collection/attributes/all/v4`.replace(
        ':collection',
        collection,
      );

    return this.fetchWithApiKey(url);
  }

  async getAttributeStats(collection: string): Promise<AttributeStatsResponse> {
    const url =
      `${RESERVOIR_BASE_URI}/collections/:collection/attributes/explore/v5`.replace(
        ':collection',
        collection,
      );

    return this.fetchWithApiKey<AttributeStatsResponse>(url);
  }

  async getContractMetadata(contract: string) {
    const url = `${RESERVOIR_BASE_URI}/collections/v7`;
    const queryParams: CollectionMetadataQueryParams = {
      id: contract,
      excludeNsfw: true,
      excludeSpam: true,
    };

    return this.fetchWithApiKey<CollectionMetadataResponse>(url, queryParams);
  }

  async getTokens(collection: string): Promise<TokensResponse> {
    const url = `${RESERVOIR_BASE_URI}/tokens/v7`;
    const queryParams: TokensQueryParams = {
      collection,
    };
    return this.fetchWithApiKey<TokensResponse>(url, queryParams);
  }

  private async fetchWithApiKey<T>(url: string, params?: any): Promise<T> {
    const res = await firstValueFrom(
      this.httpService.get<T>(url, {
        params,
        headers: {
          'x-api-key':
            this.configService.getOrThrow<ReservoirConfig>('reservoir').apiKey,
        },
      }),
    );
    return res.data;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // private async fetchPaginatedWithApiKey<T extends PaginatedResponse, Y extends 'attributes' | 'tokens'>(
  //   url: string,
  //   params?: any,
  // ): Promise<T> {
  //   const _fetchWithApiKey = async <Y>(url: string, params?: any) =>
  //     firstValueFrom(
  //       this.httpService.get<T>(url, {
  //         params,
  //         headers: {
  //           'x-api-key':
  //             this.configService.getOrThrow<ReservoirConfig>('reservoir')
  //               .apiKey,
  //         },
  //       }),
  //     ).then((res) => {
  //       if (res.data.continuation) {
  //         res.data[Y].push(
  //           _fetchWithApiKey(url, {
  //             ...params,
  //             continuation: res.data.continuation,
  //           }),
  //         );
  //       } else {
  //         return res;
  //       }
  //     });
  //
  //   const res = await _fetchWithApiKey<Y>(url, params);
  //   return res.data;
  // }
}
