import { Controller, Param, Post } from '@nestjs/common';
import { MetadataService } from '../services/metadata.service';

@Controller()
export class MetadataController {
  constructor(private readonly metadataService: MetadataService) {}

  @Post('/metadata/:collection')
  getNftAttributes(@Param('collection') collection: string) {
    return this.metadataService.refreshMetadata(collection);
  }
}
