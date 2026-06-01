import { Injectable, signal, computed } from '@angular/core';
import { CartItem, Product } from '../models/product';

/**
 * Servicio CartService
 * Gestiona el estado del carrito de compras utilizando Signals de Angular.
 * Provee métodos para agregar, eliminar, actualizar cantidades y procesar el pago.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {

  /** Signal que contiene los items del carrito */
  private _items = signal<CartItem[]>([]);

  /** Signal de solo lectura expuesta a los componentes */
  readonly items = this._items.asReadonly();

  /** Total monetario calculado reactivamente con computed */
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.precioFinal * item.cantidad, 0)
  );

  /** Total de unidades en el carrito */
  readonly totalUnidades = computed(() =>
    this._items().reduce((sum, item) => sum + item.cantidad, 0)
  );

  /**
   * Calcula el precio final de un producto aplicando el descuento.
   * @param product - Producto a calcular
   * @returns Precio final con descuento
   */
  calcularPrecioFinal(product: Product): number {
    if (product.descuento > 0) {
      return parseFloat((product.precio * (1 - product.descuento / 100)).toFixed(2));
    }
    return product.precio;
  }

  /**
   * Agrega un producto al carrito. Si ya existe, incrementa su cantidad.
   * Valida que no se supere el stock disponible.
   * @param product  - Producto a agregar
   * @param cantidad - Cantidad a agregar (mínimo 1)
   * @returns true si se agregó correctamente, false si hay error de stock
   */
  addItem(product: Product, cantidad: number = 1): boolean {
    const current = this._items();
    const existingIndex = current.findIndex(i => i.product.id === product.id);

    if (existingIndex >= 0) {
      const existing = current[existingIndex];
      const newQty = existing.cantidad + cantidad;

      // Validar stock disponible
      if (newQty > product.stock) return false;

      const updated = [...current];
      updated[existingIndex] = { ...existing, cantidad: newQty };
      this._items.set(updated);
    } else {
      // Nuevo item en el carrito
      const newItem: CartItem = {
        product,
        cantidad,
        precioFinal: this.calcularPrecioFinal(product)
      };
      this._items.set([...current, newItem]);
    }
    return true;
  }

  /**
   * Incrementa en 1 la cantidad de un item del carrito.
   * @param productId - ID del producto a incrementar
   */
  incrementItem(productId: number): void {
    this._items.update(items =>
      items.map(item => {
        if (item.product.id === productId && item.cantidad < item.product.stock) {
          return { ...item, cantidad: item.cantidad + 1 };
        }
        return item;
      })
    );
  }

  /**
   * Decrementa en 1 la cantidad. Si llega a 0, elimina el item.
   * @param productId - ID del producto a decrementar
   */
  decrementItem(productId: number): void {
    this._items.update(items => {
      return items
        .map(item => {
          if (item.product.id === productId) {
            return { ...item, cantidad: item.cantidad - 1 };
          }
          return item;
        })
        .filter(item => item.cantidad > 0);
    });
  }

  /**
   * Elimina completamente un item del carrito.
   * @param productId - ID del producto a eliminar
   */
  removeItem(productId: number): void {
    this._items.update(items => items.filter(i => i.product.id !== productId));
  }

  /**
   * Vacía completamente el carrito (usado al procesar el pago).
   */
  clearCart(): void {
    this._items.set([]);
  }
}
