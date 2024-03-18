import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ReservoirService } from './services/reservoir.service';

@Module({
  imports: [HttpModule],
  providers: [ReservoirService],
  controllers: [],
  exports: [ReservoirService],
})
export class ReservoirModule {}
