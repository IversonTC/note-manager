import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MapearServiciosService {
   mapToSelectOptions(data: any[], value: string, label: string) {
    return data.map(item => ({
      value: item[value],
      label: item[label]
    }));
  }
}
