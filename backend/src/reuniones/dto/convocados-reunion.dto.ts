import { IsArray, IsString } from 'class-validator';

export class ConvocadosReunionDto {
  @IsArray()
  @IsString({ each: true })
  convocados: string[];
}
