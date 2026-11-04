import { IsString, MinLength } from 'class-validator';

export class CrearChecklistDto {
  @IsString()
  @MinLength(1)
  titulo: string;
}
