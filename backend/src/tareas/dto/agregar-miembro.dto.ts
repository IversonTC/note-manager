import { IsString, IsOptional } from 'class-validator';

export class AgregarMiembroDto {
  @IsString()
  codigo: string;

  @IsOptional()
  @IsString()
  rol?: string;
}
