import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart';

/**
 * Componente NavbarComponent
 * Barra de navegación principal. Muestra el logo, barra de búsqueda global
 * y el botón del carrito con el total y cantidad de items.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {

  /** Servicio del carrito inyectado */
  cartService = inject(CartService);

  /** Texto de búsqueda global enlazado con two-way binding */
  @Input() busquedaGlobal: string = '';

  /** Emite el texto de búsqueda al componente padre cuando cambia */
  @Output() busquedaChange = new EventEmitter<string>();

  /** Emite evento para abrir el modal del carrito */
  @Output() abrirCarrito = new EventEmitter<void>();

  /**
   * Notifica al padre cada vez que cambia el texto de búsqueda.
   */
  onBusquedaChange(): void {
    this.busquedaChange.emit(this.busquedaGlobal);
  }

  /**
   * Emite el evento para abrir el modal del carrito.
   */
  onAbrirCarrito(): void {
    this.abrirCarrito.emit();
  }
}
