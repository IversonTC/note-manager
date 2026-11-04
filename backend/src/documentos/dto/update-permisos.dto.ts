import { IsArray, ValidateNested, IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

class PersonaPermiso {
  @IsString()
  codigo_colab: string;

  @IsNumber()
  tipo: number;
}

export class UpdatePermisosDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PersonaPermiso)
  personas: PersonaPermiso[];
}
