import { IsString, IsIn } from 'class-validator';

export class FirmarPermisoDto {
  @IsString()
  @IsIn(['solicitante', 'autorizador'])
  firma: string;
}
