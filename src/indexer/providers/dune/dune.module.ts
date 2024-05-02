import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DuneService } from './services/dune.service';

@Module({
  imports: [HttpModule],
  exports: [DuneService],
  controllers: [],
  providers: [DuneService],
})
export class DuneModule {}
