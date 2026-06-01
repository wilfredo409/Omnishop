/**
 * Interfaz que define la estructura de un producto en OmniShop.
 * Todos los campos provienen del archivo productos.json en /public.
 */
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  /** Porcentaje de descuento (0 = sin descuento) */
  descuento: number;
  categoria: string;
  tag: string;
  imagen: string;
  /** Rating del 1 al 5 */
  rating: number;
  /** true = aparece en la sección de productos destacados */
  destacado: boolean;
  stock: number;
}

/**
 * Interfaz para un item dentro del carrito de compras.
 * Extiende el producto con cantidad y precio final calculado.
 */
export interface CartItem {
  product: Product;
  cantidad: number;
  /** Precio final después de aplicar descuento */
  precioFinal: number;
}
