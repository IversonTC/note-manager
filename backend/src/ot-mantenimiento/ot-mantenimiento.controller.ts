import { Controller, Get, Post, Body } from '@nestjs/common';
import { OtMantenimientoService } from './ot-mantenimiento.service';
import { CrearOtDto } from './dto/crear-ot.dto';
import { unwrapResponse } from '../common/helpers';

@Controller('ot-mantenimiento')
export class OtMantenimientoController {
  constructor(private readonly service: OtMantenimientoService) {}

  @Get('empresas')
  async findEmpresas() {
    return unwrapResponse(await this.service.findEmpresas());
  }

  @Get()
  async findAll() {
    return unwrapResponse(await this.service.findAll());
  }

  @Post()
  async create(@Body() dto: CrearOtDto) {
    return unwrapResponse(await this.service.create(dto));
  }
}
