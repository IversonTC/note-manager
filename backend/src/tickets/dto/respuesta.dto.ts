import { IsString } from 'class-validator';

export class RespuestaDto {
  @IsString()
  respuesta: string;
}
