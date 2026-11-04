import { IsArray, ValidateNested, IsString, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class ModuloRol {
  @IsString()
  modulo: string;

  @IsBoolean()
  puede_ver: boolean;

  @IsBoolean()
  puede_crear: boolean;

  @IsBoolean()
  puede_editar: boolean;

  @IsBoolean()
  puede_eliminar: boolean;
}

export class ModulosRolDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuloRol)
  modulos: ModuloRol[];
}
