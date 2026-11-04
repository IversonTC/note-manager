import { IsArray, IsString } from 'class-validator';

export class ActualizarPermisosDto {
  @IsArray()
  @IsString({ each: true })
  permisos: string[];
}
