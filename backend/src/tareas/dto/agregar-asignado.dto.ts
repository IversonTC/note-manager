import { IsString } from 'class-validator';

export class AgregarAsignadoDto {
  @IsString()
  codigo: string;
}
