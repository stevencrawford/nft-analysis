import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AlchemyConfig } from '../../../common/config/config';
import { Alchemy, GetNftSalesOptionsByContractAddress, Nft } from 'alchemy-sdk';

@Injectable()
export class AlchemyService {
  private readonly alchemy: Alchemy;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const alchemyConfig = configService.getOrThrow<AlchemyConfig>('alchemy');
    const config: Pick<AlchemyConfig, 'apiKey' | 'network'> = {
      ...alchemyConfig,
    };
    this.alchemy = new Alchemy(config);
  }

  public async getNftsForContract(contract: string) {
    const iterator = this.alchemy.nft.getNftsForContractIterator(contract, {
      omitMetadata: false,
      pageSize: 100,
    });
    const nfts: Nft[] = [];
    for await (const nft of iterator) {
      nfts.push(nft);
    }
    return nfts;
  }

  public async summarizeNFTAttributes(contract: string) {
    return await this.alchemy.nft.summarizeNftAttributes(contract);
  }

  public async getNftSales(contract: string) {
    return this.alchemy.nft.getNftSales({
      contractAddress: contract,
      limit: 1000,
    } as GetNftSalesOptionsByContractAddress);
  }

  async getContractMetadata(contract: string) {
    return this.alchemy.nft.getContractMetadata(contract);
  }
}
