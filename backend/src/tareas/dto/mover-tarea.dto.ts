import { IsInt } from 'class-validator';

export class MoverTareaDto {
  @IsInt()
  columna_id: number;

  @IsInt()
  posicion: number;
}
