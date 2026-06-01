import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

/**
 * Servicio ProductService
 * Responsable de cargar y proveer los datos de productos
 * desde el archivo JSON ubicado en /public/productos.json.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  /** Ruta al archivo JSON de productos en la carpeta public */
  private readonly JSON_URL = 'productos.json';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todos los productos desde el archivo JSON.
   * @returns Observable con el arreglo de productos
   */
  getProducts(): Observable<{ productos: Product[]; categorias: string[] }> {
    return this.http.get<{ productos: Product[]; categorias: string[] }>(this.JSON_URL);
  }
}
