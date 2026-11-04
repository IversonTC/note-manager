import { Controller, Get, Param } from '@nestjs/common';
import { PaletaColoresService } from './paleta-colores.service';
import { unwrapResponse } from '../common/helpers';

@Controller('paleta-colores')
export class PaletaColoresController {
  constructor(private readonly service: PaletaColoresService) {}

  @Get(':empresa')
  async findByEmpresa(@Param('empresa') empresa: string) {
    return unwrapResponse(await this.service.findByEmpresa(empresa));
  }
}
