import { IsString, IsOptional, IsInt } from 'class-validator';

export class ComentarioDto {
  @IsString()
  comentario: string;

  @IsOptional()
  @IsInt()
  estado_id?: number;
}
