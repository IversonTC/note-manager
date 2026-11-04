import { Module } from '@nestjs/common';
import { OtMantenimientoController } from './ot-mantenimiento.controller';
import { OtMantenimientoService } from './ot-mantenimiento.service';

@Module({
  controllers: [OtMantenimientoController],
  providers: [OtMantenimientoService],
})
export class OtMantenimientoModule {}
