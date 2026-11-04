import { IsArray, IsInt } from 'class-validator';

export class ReordenarColumnasDto {
  @IsArray()
  @IsInt({ each: true })
  columnas: number[];
}
