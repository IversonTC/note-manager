import { IsString, IsOptional, IsInt, MinLength } from 'class-validator';

export class CrearColumnaDto {
  @IsString()
  @MinLength(1)
  nombre: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsInt()
  posicion?: number;
}
