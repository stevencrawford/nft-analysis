import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AlchemyConfig } from '../../../common/config/config';
import { Alchemy, NftSaleTakerType, SortingOrder } from 'alchemy-sdk';
import {
  Collection,
  SalesTx,
  Token,
  Traits,
  Web3Provider,
  WithRarity,
} from '../../common/interfaces/web3-provider.interface';
import { toCollection, toSalesTxs, toToken } from '../utils/alchemy.util';

@Injectable()
export class AlchemyService implements Web3Provider {
  private readonly alchemy: Alchemy;

  constructor(private readonly configService: ConfigService) {
    const alchemyConfig = configService.getOrThrow<AlchemyConfig>('alchemy');
    const config: Pick<AlchemyConfig, 'apiKey' | 'network'> = {
      ...alchemyConfig,
    };
    this.alchemy = new Alchemy(config);
  }

  async getNftTokens(collection: string): Promise<Token[]> {
    const iterator = this.alchemy.nft.getNftsForContractIterator(collection, {
      omitMetadata: false,
      pageSize: 100,
    });
    const tokens: Token[] = [];
    for await (const nft of iterator) {
      tokens.push(toToken(nft));
    }
    tokens.sort((t1, t2) => t1.tokenId.localeCompare(t2.tokenId));
    return tokens;
  }

  public async getNftCollectionTraits(
    collection: string,
    tokenSupply: number,
  ): Promise<Traits<WithRarity>> {
    const response = await this.alchemy.nft.summarizeNftAttributes(collection);
    const traits: Traits<WithRarity> = {};
    for (const [attribute, values] of Object.entries(response.summary)) {
      traits[attribute] ??= {};
      for (const [value, count] of Object.entries(values)) {
        traits[attribute][value] = {
          count,
          rarity: count / tokenSupply,
        };
      }
    }
    return traits;
  }

  public async getNftSales(
    collection: string,
    fromBlock?: number,
  ): Promise<SalesTx[]> {
    const response = await this.alchemy.nft.getNftSales({
      contractAddress: collection,
      fromBlock: fromBlock ?? 0,
      toBlock: 'latest',
      taker: NftSaleTakerType.BUYER,
      limit: 1000,
      order: SortingOrder.DESCENDING,
    });
    return toSalesTxs(response);
  }

  async getNftCollectionMetadata(contract: string): Promise<Collection> {
    const alchemyContract =
      await this.alchemy.nft.getContractMetadata(contract);
    return toCollection(alchemyContract);
  }
}
