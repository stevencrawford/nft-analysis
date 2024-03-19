import { Injectable } from '@nestjs/common';
import {
  Collection,
  SalesTx,
  Token,
  Traits,
  Web3Provider,
  WithRarity,
} from '../../common/interfaces/web3-provider.interface';

@Injectable()
export class DuneService implements Web3Provider {
  constructor() {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNftCollectionMetadata(collection: string): Promise<Collection> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNftSales(collection: string, fromBlock?: number): Promise<SalesTx[]> {
    throw new Error('Method not implemented.');
  }
  getNftCollectionTraits(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    collection: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    tokenSupply: number,
  ): Promise<Traits<WithRarity>> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getNftTokens(collection: string): Promise<Token[]> {
    throw new Error('Method not implemented.');
  }
}
