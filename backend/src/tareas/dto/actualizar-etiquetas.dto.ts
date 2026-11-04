import { IsArray, IsInt } from 'class-validator';

export class ActualizarEtiquetasDto {
  @IsArray()
  @IsInt({ each: true })
  etiquetas: number[];
}
