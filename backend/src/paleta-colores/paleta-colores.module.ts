import { Module } from '@nestjs/common';
import { PaletaColoresController } from './paleta-colores.controller';
import { PaletaColoresService } from './paleta-colores.service';

@Module({
  controllers: [PaletaColoresController],
  providers: [PaletaColoresService],
})
export class PaletaColoresModule {}
