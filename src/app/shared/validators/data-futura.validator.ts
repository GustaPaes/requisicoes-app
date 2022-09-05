import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";


export function dataFuturaValidator(): ValidatorFn {
  return (input: AbstractControl): ValidationErrors | null => {
    const dataInserida = moment(input.value);
    const hoje = moment();

    if (!dataInserida) return null;

    return dataInserida.isAfter(hoje) ? { datafutura: true } : null;
  }
}
