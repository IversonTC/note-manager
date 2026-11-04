import { IsString, IsOptional, MinLength } from 'class-validator';

export class CrearEquipoDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  propietario?: string;
}
