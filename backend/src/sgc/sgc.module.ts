import { Module } from '@nestjs/common';
import { SgcController } from './sgc.controller';
import { SgcService } from './sgc.service';

@Module({
  controllers: [SgcController],
  providers: [SgcService],
})
export class SgcModule {}
