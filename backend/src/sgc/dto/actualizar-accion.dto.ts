import { PartialType } from '@nestjs/mapped-types';
import { CrearAccionDto } from './crear-accion.dto';

export class ActualizarAccionDto extends PartialType(CrearAccionDto) {}
