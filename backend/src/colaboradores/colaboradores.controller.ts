import { Controller, Get, Param, Query } from '@nestjs/common';
import { ColaboradoresService } from './colaboradores.service';
import { FiltrarColaboradoresDto } from './dto/filtrar-colaboradores.dto';
import { unwrapResponse } from '../common/helpers';

@Controller('colaboradores')
export class ColaboradoresController {
  constructor(private readonly service: ColaboradoresService) {}

  @Get()
  async findAll(@Query() dto: FiltrarColaboradoresDto) {
    return unwrapResponse(await this.service.findAll(dto));
  }

  @Get(':codigo/accesos')
  async findAccesos(@Param('codigo') codigo: string) {
    return unwrapResponse(await this.service.findAccesos(codigo));
  }
}
