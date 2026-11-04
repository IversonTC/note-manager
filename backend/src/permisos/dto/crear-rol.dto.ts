import { IsString } from 'class-validator';

export class CrearRolDto {
  @IsString()
  nombre: string;
}
