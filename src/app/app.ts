import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavbarComponent }       from './components/navbar/navbar';
import { HeroSliderComponent }   from './components/hero-slider/hero-slider';
import { ProductCardComponent }  from './components/product-card/product-card';
import { ProductModalComponent } from './components/product-modal/product-modal';
import { CartModalComponent }    from './components/cart-modal/cart-modal';

import { ProductService } from './services/product';
import { Product } from './models/product';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    HeroSliderComponent,
    ProductCardComponent,
    ProductModalComponent,
    CartModalComponent
  ],
  templateUrl: './app.html',
  styleUrl:    './app.css'
})
export class App implements OnInit {

  private productService = inject(ProductService);

  productos        = signal<Product[]>([]);
  categorias       = signal<string[]>([]);
  categoriaActiva  = signal<string>('');
  filtroBusqueda   = signal<string>('');
  busquedaGlobal   = signal<string>('');

  productoSeleccionado = signal<Product | null>(null);
  mostrarCartModal     = signal<boolean>(false);

  toastVisible = signal<boolean>(false);
  toastMensaje = signal<string>('');
  toastTipo    = signal<'success' | 'error'>('success');
  private toastTimer: any;

  /** Productos filtrados por categoría y búsqueda */
  productosFiltrados = computed(() => {
    let lista = this.productos();
    const cat  = this.categoriaActiva();
    const txt  = this.filtroBusqueda().toLowerCase().trim();
    const glob = this.busquedaGlobal().toLowerCase().trim();

    if (cat)  lista = lista.filter(p => p.categoria === cat);
    if (txt)  lista = lista.filter(p => p.nombre.toLowerCase().includes(txt));
    if (glob) lista = lista.filter(p =>
      p.nombre.toLowerCase().includes(glob) ||
      p.descripcion.toLowerCase().includes(glob) ||
      p.categoria.toLowerCase().includes(glob)
    );
    return lista;
  });

  /**
   * Destacados filtrados por la categoría activa.
   * Si no hay categoría activa, muestra todos los destacados.
   */
  productosDestacados = computed(() => {
    const cat = this.categoriaActiva();
    return this.productos()
      .filter(p => p.destacado && (cat === '' || p.categoria === cat))
      .slice(0, 8);
  });

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: data => {
        this.productos.set(data.productos);
        this.categorias.set(data.categorias);
      },
      error: () => this.mostrarToast('Error al cargar los productos.', 'error')
    });
  }

  /** Cambia la categoría activa, limpia búsqueda y hace scroll suave */
  setCategoriaTab(cat: string): void {
  this.categoriaActiva.set(cat);
  this.filtroBusqueda.set('');
  setTimeout(() => {
    const el = document.getElementById('productos');
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 64;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, 50);
}

  onFiltroBusquedaChange(val: string): void { this.filtroBusqueda.set(val); }
  onBusquedaGlobalChange(val: string):  void { this.busquedaGlobal.set(val); }

  abrirModal(producto: Product): void { this.productoSeleccionado.set(producto); }
  cerrarModal(): void                  { this.productoSeleccionado.set(null); }

  abrirCarrito(): void  { this.mostrarCartModal.set(true); }
  cerrarCarrito(): void { this.mostrarCartModal.set(false); }

  /**
   * Recibe el evento del modal de producto cuando se agrega un item.
   * Reduce el stock del producto en la lista local para reflejarlo en las tarjetas.
   */
  onProductoAgregado(event: { productoId: number; cantidad: number }): void {
    this.productos.update(lista =>
      lista.map(p =>
        p.id === event.productoId
          ? { ...p, stock: p.stock - event.cantidad }
          : p
      )
    );
  }

  mostrarToast(msg: string, tipo: 'success' | 'error'): void {
    clearTimeout(this.toastTimer);
    this.toastMensaje.set(msg);
    this.toastTipo.set(tipo);
    this.toastVisible.set(true);
    this.toastTimer = setTimeout(() => this.toastVisible.set(false), 3200);
  }

  onToast(event: { msg: string; tipo: 'success' | 'error' }): void {
    this.mostrarToast(event.msg, event.tipo);
  }

  precioFinal(p: Product): number {
    return p.descuento > 0
      ? parseFloat((p.precio * (1 - p.descuento / 100)).toFixed(2))
      : p.precio;
  }
}
