import { IsString, MinLength } from 'class-validator';

export class CrearEtiquetaDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsString()
  color: string;
}
