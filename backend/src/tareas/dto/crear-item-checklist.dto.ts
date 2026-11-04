import { IsString, MinLength } from 'class-validator';

export class CrearItemChecklistDto {
  @IsString()
  @MinLength(1)
  texto: string;
}
