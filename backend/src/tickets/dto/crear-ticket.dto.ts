import { IsString, IsInt } from 'class-validator';

export class CrearTicketDto {
  @IsString()
  detalle: string;

  @IsInt()
  prioridad_id: number;

  @IsInt()
  categoria_id: number;
}
