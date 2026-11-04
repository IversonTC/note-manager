import { IsInt } from 'class-validator';

export class CambiarEstadoDto {
  @IsInt()
  estado_id: number;
}
