import { PartialType } from '@nestjs/mapped-types';
import { CrearReunionDto } from './crear-reunion.dto';

export class ActualizarReunionDto extends PartialType(CrearReunionDto) {}
