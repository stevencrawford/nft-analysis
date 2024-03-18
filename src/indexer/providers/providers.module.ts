import { Module } from '@nestjs/common';
import { ReservoirService } from './reservoir/services/reservoir.service';
import { AlchemyService } from './alchemy/services/alchemy.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  exports: [AlchemyService, ReservoirService],
  controllers: [],
  providers: [AlchemyService, ReservoirService],
})
export class ProvidersModule {}
