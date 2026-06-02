import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { DiscountPricePipe } from '../../pipes/discount-price-pipe';
import { StarsPipe } from '../../pipes/stars-pipe';
import { CartService } from '../../services/cart';

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
  @Output() toastMsg = new EventEmitter<{ msg: string; tipo: 'success' | 'error' }>();
  @Output() productoAgregado = new EventEmitter<{ productoId: number; cantidad: number }>();
private cartService = inject(CartService);

  /**
   * Emite el evento para abrir el modal de detalle.
   */
  onVerDetalles(): void {
    this.verDetalles.emit(this.product);
  }
onAgregarRapido(): void {
  const ok = this.cartService.addItem(this.product, 1);
  if (ok) {
    this.productoAgregado.emit({ productoId: this.product.id, cantidad: 1 });
    this.toastMsg.emit({ msg: `"${this.product.nombre}" agregado al carrito.`, tipo: 'success' });
  } else {
    this.toastMsg.emit({ msg: 'No hay suficiente stock.', tipo: 'error' });
  }
}
}
