import { PartialType } from '@nestjs/mapped-types';
import { CrearRecordatorioDto } from './crear-recordatorio.dto';

export class ActualizarRecordatorioDto extends PartialType(CrearRecordatorioDto) {}
