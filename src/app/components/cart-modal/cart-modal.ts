import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

/**
 * Componente CartModalComponent
 * Modal del carrito de compras. Muestra la tabla con todos los items,
 * permite cambiar cantidades, eliminar productos y procesar el pago.
 * Al pagar, vacía el carrito y emite un evento de éxito.
 */
@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css'
})
export class CartModalComponent {

  /** Emite cuando el usuario cierra el modal */
  @Output() cerrar = new EventEmitter<void>();

  /** Emite mensaje de éxito/error para el toast */
  @Output() toastMsg = new EventEmitter<{ msg: string; tipo: 'success' | 'error' }>();

  cartService = inject(CartService);

  /** Cierra el modal */
  onCerrar(): void {
    this.cerrar.emit();
  }

  /**
   * Incrementa la cantidad de un item del carrito.
   * @param productId - ID del producto
   */
  incrementar(productId: number): void {
    this.cartService.incrementItem(productId);
  }

  /**
   * Decrementa la cantidad de un item del carrito.
   * Si llega a 0, el servicio lo elimina automáticamente.
   * @param productId - ID del producto
   */
  decrementar(productId: number): void {
    this.cartService.decrementItem(productId);
  }

  /**
   * Elimina completamente un item del carrito.
   * @param productId - ID del producto
   */
  eliminar(productId: number): void {
    this.cartService.removeItem(productId);
  }

  /**
   * Simula el proceso de pago:
   * 1. Registra el total a pagar
   * 2. Vacía el carrito
   * 3. Cierra el modal
   * 4. Emite un mensaje de éxito con el total pagado
   */
@Output() stockReducido = new EventEmitter<{ productoId: number; cantidad: number }[]>();

onPagar(): void {
  const total = this.cartService.total();
  // Emitir los items antes de limpiar el carrito
  const itemsVendidos = this.cartService.items().map(i => ({
    productoId: i.product.id,
    cantidad: i.cantidad
  }));
  this.cartService.clearCart();
  this.stockReducido.emit(itemsVendidos);
  this.cerrar.emit();
  this.toastMsg.emit({
    msg: `¡Pago exitoso! $${total.toFixed(2)} procesados. ¡Gracias por tu compra!`,
    tipo: 'success'
  });
}
}
