import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { DiscountPricePipe } from '../../pipes/discount-price-pipe';
import { StarsPipe } from '../../pipes/stars-pipe';

/**
 * Componente ProductCardComponent
 * Tarjeta de producto individual. Muestra imagen, nombre, precio,
 * descuento (con precio tachado si aplica), rating, tag y botón de detalles.
 * Es un componente presentacional: recibe datos por @Input y emite eventos.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, DiscountPricePipe, StarsPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {

  /** Producto a mostrar en la tarjeta */
  @Input() product!: Product;

  /** Emite el producto cuando el usuario hace clic en "Detalles" */
  @Output() verDetalles = new EventEmitter<Product>();

  /**
   * Emite el evento para abrir el modal de detalle.
   */
  onVerDetalles(): void {
    this.verDetalles.emit(this.product);
  }
}
