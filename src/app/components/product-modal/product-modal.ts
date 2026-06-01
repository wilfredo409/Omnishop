import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart';
import { StarsPipe } from '../../pipes/stars-pipe';

/**
 * Modal de detalle de producto.
 * Al agregar al carrito emite:
 * - toastMsg: para mostrar notificación
 * - productoAgregado: para que el padre reduzca el stock en la lista
 */
@Component({
  selector: 'app-product-modal',
  standalone: true,
  imports: [CommonModule, StarsPipe],
  templateUrl: './product-modal.html',
  styleUrl: './product-modal.css'
})
export class ProductModalComponent implements OnChanges {

  @Input() product: Product | null = null;
  @Output() cerrar      = new EventEmitter<void>();
  @Output() toastMsg    = new EventEmitter<{ msg: string; tipo: 'success' | 'error' }>();
  /** Emite id y cantidad para que el padre actualice el stock visible */
  @Output() productoAgregado = new EventEmitter<{ productoId: number; cantidad: number }>();

  cartService = inject(CartService);
  cantidad: number = 1;

  ngOnChanges(): void {
    if (this.product) this.cantidad = 1;
  }

  incrementar(): void {
    if (this.product && this.cantidad < this.product.stock) this.cantidad++;
  }

  decrementar(): void {
    if (this.cantidad > 1) this.cantidad--;
  }

  get precioFinal(): number {
    if (!this.product) return 0;
    return this.product.descuento > 0
      ? parseFloat((this.product.precio * (1 - this.product.descuento / 100)).toFixed(2))
      : this.product.precio;
  }

  get subtotal(): number {
    return parseFloat((this.precioFinal * this.cantidad).toFixed(2));
  }

  onAgregar(): void {
    if (!this.product) return;
    if (this.cantidad < 1) {
      this.toastMsg.emit({ msg: 'La cantidad debe ser al menos 1.', tipo: 'error' });
      return;
    }
    if (this.cantidad > this.product.stock) {
      this.toastMsg.emit({ msg: 'No hay suficiente stock disponible.', tipo: 'error' });
      return;
    }

    const ok = this.cartService.addItem(this.product, this.cantidad);
    if (ok) {
      // Notificar al padre para reducir el stock mostrado en tarjetas
      this.productoAgregado.emit({ productoId: this.product.id, cantidad: this.cantidad });
      this.toastMsg.emit({ msg: `"${this.product.nombre}" agregado al carrito.`, tipo: 'success' });
      this.cerrar.emit();
    } else {
      this.toastMsg.emit({ msg: 'No hay suficiente stock disponible.', tipo: 'error' });
    }
  }

  onCancelar(): void { this.cerrar.emit(); }
}
