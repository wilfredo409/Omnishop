import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente HeroSliderComponent
 * Slider con 4 diapositivas. El botón CTA de cada slide emite
 * un evento con la categoría correspondiente para que el padre
 * active el filtro correcto en lugar de solo hacer scroll.
 */
@Component({
  selector: 'app-hero-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-slider.html',
  styleUrl: './hero-slider.css'
})
export class HeroSliderComponent {

  /** Emite la categoría al hacer clic en el botón CTA de cada slide */
  @Output() categoriaSeleccionada = new EventEmitter<string>();

  currentIndex: number = 0;

  slides = [
    {
      image: 'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=1400&h=500&fit=crop',
      label: 'Novedades 2026',
      title: 'El futuro de la tecnología está aquí',
      cta: 'Ver Electrónica',
      categoria: 'Electrónica'
    },
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=500&fit=crop',
      label: 'Nueva Colección',
      title: 'Moda que define tu estilo único',
      cta: 'Explorar Ropa',
      categoria: 'Ropa'
    },
    {
      image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1400&h=500&fit=crop',
      label: 'Temporada Activa',
      title: 'Equípate para superar tus metas',
      cta: 'Ver Deportes',
      categoria: 'Deportes'
    },
    {
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&h=500&fit=crop',
      label: 'Oferta Especial',
      title: 'Transforma tu hogar con estilo',
      cta: 'Ver Hogar',
      categoria: 'Hogar'
    }
  ];

  constructor() {
    setInterval(() => this.next(), 4500);
  }

  next(): void { this.currentIndex = (this.currentIndex + 1) % this.slides.length; }
  prev(): void { this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length; }
  goTo(index: number): void { this.currentIndex = index; }

  /** Emite la categoría del slide actual al padre */
  onCtaClick(categoria: string): void {
    this.categoriaSeleccionada.emit(categoria);
  }
}
