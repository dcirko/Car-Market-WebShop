import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euroCurrency',
  standalone: true
})
export class CurrencyPipe implements PipeTransform {

  transform(value: number): string {
    if (!value) return 'N/A'; 
    return `${value.toLocaleString('hr-HR')} €`;
  }
}


