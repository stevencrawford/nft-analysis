import { Module } from '@nestjs/common';
import { AlchemyService } from './services/alchemy.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [AlchemyService],
})
export class AlchemyModule {}
