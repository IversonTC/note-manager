import { Module } from '@nestjs/common';
import { PermisosLaboralesController } from './permisos-laborales.controller';
import { PermisosLaboralesService } from './permisos-laborales.service';

@Module({
  controllers: [PermisosLaboralesController],
  providers: [PermisosLaboralesService],
})
export class PermisosLaboralesModule {}
