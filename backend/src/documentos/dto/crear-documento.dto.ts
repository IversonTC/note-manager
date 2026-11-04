import { IsString, IsOptional, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PersonaPermiso {
  @IsString()
  codigo_colab: string;

  @IsOptional()
  tipo?: number;
}

export class CrearDocumentoDto {
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  contenido?: string;

  @IsOptional()
  @IsString()
  categoria?: string;

  @IsOptional()
  @IsBoolean()
  publico?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonaPermiso)
  personas?: PersonaPermiso[];
}
