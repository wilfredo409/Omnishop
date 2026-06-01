import { Pipe, PipeTransform } from '@angular/core';

/**
 * Pipe: discountPrice
 * Calcula el precio final de un producto aplicando su porcentaje de descuento.
 * Uso en template: {{ producto.precio | discountPrice: producto.descuento }}
 */
@Pipe({
  name: 'discountPrice',
  standalone: true
})
export class DiscountPricePipe implements PipeTransform {
  /**
   * @param precio    - Precio original del producto
   * @param descuento - Porcentaje de descuento (0-100)
   * @returns Precio final con descuento aplicado, redondeado a 2 decimales
   */
  transform(precio: number, descuento: number): number {
    if (!precio) return 0;
    if (!descuento || descuento <= 0) return precio;
    return parseFloat((precio * (1 - descuento / 100)).toFixed(2));
  }
}
