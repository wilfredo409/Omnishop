import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe: stars
 * Convierte un número de rating en un arreglo para iterar en el template.
 * Uso: *ngFor="let s of product.rating | stars"
 */
@Pipe({
  name: 'stars',
  standalone: true
})
export class StarsPipe implements PipeTransform {
  /**
   * @param rating  - Valor del rating (1-5)
   * @param filled  - true = estrellas llenas, false = estrellas vacías
   * @returns Arreglo de longitud correspondiente para usar con *ngFor
   */
  transform(rating: number, filled: boolean = true): number[] {
    const clamped = Math.max(0, Math.min(5, rating));
    const count = filled ? clamped : 5 - clamped;
    return Array(count).fill(0);
  }
}
