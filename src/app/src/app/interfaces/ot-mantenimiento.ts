export interface OtEmpresa {
  emp_id:     string;
  emp_nombre: string;
}

export interface OtMantenimiento {
  ot_consecutivo:           number;
  ot_fecha_solicitud:       string;
  ot_empresa:               string;
  ot_solicitante_ubicacion: string;
  ot_solicitante_descripcion: string;
  estado?:                  string;
  eot_nombre?:              string;   // campo del backend anterior
}

export interface CrearOtDto {
  ot_empresa:                  string;
  ot_solicitante_ubicacion:    string;
  ot_solicitante_descripcion:  string;
}
