import { IsOptional, IsString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class FiltrarColaboradoresDto {
  @IsOptional()
  @IsString()
  empresas?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  estado?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  pagina?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  por_pagina?: number;

  @IsOptional()
  @IsString()
  buscar?: string;

  @IsOptional()
  @IsString()
  centro_costo?: string;

  @IsOptional()
  @IsString()
  todos?: string;

  @IsOptional()
  @IsString()
  paginar?: string;
}
