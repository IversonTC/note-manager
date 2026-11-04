import { IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class ActividadDto {
  @IsString()
  actividad: string;

  @IsOptional()
  @IsString()
  responsable?: string;

  @IsOptional()
  @IsString()
  nom_responsable?: string;

  @IsString()
  fecha_implementacion: string;
}

export class ActividadesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActividadDto)
  actividades: ActividadDto[];
}
