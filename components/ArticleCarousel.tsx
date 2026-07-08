import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, BookOpen } from 'lucide-react';
import { Article } from '../types';

const ARTICLES: Article[] = [
  {
    id: 'a1',
    title: '5 hábitos para una vida saludable',
    subtitle: 'Pequeños cambios diarios que generan un impacto enorme en tu bienestar a largo plazo.',
    category: 'Bienestar',
    specialty: 'General',
    author: 'Dr. Goyo',
    status: 'published',
    publishDate: '2024-06-10',
    views: 320,
    image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'a2',
    title: 'La importancia de la hidratación en el trópico',
    subtitle: 'Cómo el clima cálido afecta tu cuerpo y por qué el agua es tu mejor aliada.',
    category: 'Nutrición',
    specialty: 'Nutricionista',
    author: 'Dra. Ana',
    status: 'published',
    publishDate: '2024-06-12',
    views: 210,
    image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'a3',
    title: 'Ejercicio moderado vs. intenso: ¿Cuál elegir?',
    subtitle: 'Analizamos los beneficios de cada tipo de entrenamiento según tu edad y objetivos.',
    category: 'Medicina General',
    specialty: 'General',
    author: 'Dr. Goyo',
    status: 'published',
    publishDate: '2024-06-08',
    views: 180,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'g1',
    title: 'El impacto del sueño en la salud cardiovascular',
    subtitle: 'Descubre por qué dormir 8 horas es tan importante como hacer ejercicio para mantener tu corazón fuerte.',
    category: 'Bienestar',
    specialty: 'Cardiólogo',
    author: 'Dra. Valentina Soto',
    status: 'published',
    publishDate: '2024-06-01',
    views: 250,
    image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=300'
  },
  {
    id: 'g2',
    title: 'Nutrición preventiva: Alimentos que fortalecen tu sistema inmune',
    subtitle: 'Una guía práctica sobre las vitaminas esenciales y dónde encontrarlas en tu dieta diaria venezolana.',
    category: 'Nutrición',
    specialty: 'Nutricionista',
    author: 'Dr. Javier Ríos',
    status: 'published',
    publishDate: '2024-06-05',
    views: 180,
    image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80&w=300'
  }
];

interface ArticleCarouselProps {
  articles?: Article[];
  autoSlide?: boolean;
  title?: string;
  onArticleClick?: (article: Article) => void;
}

export const ArticleCarousel: React.FC<ArticleCarouselProps> = ({
  articles = ARTICLES,
  autoSlide = true,
  title = 'Artículos de Opinión',
  onArticleClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardStep, setCardStep] = useState(320);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoSlide || articles.length === 0) return;

    const measureStep = () => {
      const card = trackRef.current?.querySelector('[data-article-card]');
      if (card && trackRef.current) {
        const cardWidth = (card as HTMLElement).offsetWidth;
        const parentStyle = getComputedStyle(trackRef.current);
        const gap = parseFloat(parentStyle.gap) || 24;
        setCardStep(cardWidth + gap);
      }
    };

    measureStep();
    window.addEventListener('resize', measureStep);
    return () => window.removeEventListener('resize', measureStep);
  }, [autoSlide, articles.length]);

  useEffect(() => {
    if (!autoSlide || articles.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= articles.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoSlide, articles.length]);

  if (articles.length === 0) {
    return (
      <div className="bg-gray-bg border border-border-main rounded-2xl p-6 text-center mx-4 mb-20 transition-colors">
        <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center mx-auto mb-3 text-gray-light shadow-sm">
          <BookOpen size={24} />
        </div>
        <p className="text-gray-text font-medium text-sm">No hay artículos sugeridos por ahora. ¡Vuelve más tarde!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <BookOpen size={18} className="text-primary" />
        <h3 className="font-heading font-bold text-lg text-text-main">{title}</h3>
      </div>

      <div className="overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-6 transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * cardStep}px)` }}
        >
          {articles.map((article) => (
            <div
              key={article.id}
              data-article-card
              onClick={() => onArticleClick && onArticleClick(article)}
              className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-all flex-shrink-0"
            >
              <div className="h-32 w-full overflow-hidden relative">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-card/90 backdrop-blur-sm px-2 py-0.5 rounded-md text-[10px] font-bold text-primary uppercase border border-border-main">
                  {article.category}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <h4 className="font-bold text-text-main leading-tight mb-2 line-clamp-2">
                  {article.title}
                </h4>
                <p className="text-xs text-gray-light line-clamp-2 mb-4 flex-1">
                  {article.subtitle}
                </p>

                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border-main">
                  <span className="text-[10px] text-gray-light font-medium">Por {article.author}</span>
                  <button className="text-xs font-bold text-secondary flex items-center gap-1 group-hover:gap-2 transition-all">
                    Ver más <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2">
        {articles.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-[#0D9488] w-4' : 'bg-gray-300 w-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
