import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, Search, MapPin, X, Truck } from 'lucide-react';
import { PharmacyCard } from '../components/PharmacyCard';
import { Pharmacy, Article } from '../types';
import { BottomNav } from '../components/BottomNav';
import { Pagination } from '../components/Pagination';
import { Carousel, CarouselItem } from '../components/Carousel';
import { SuggestedArticles } from '../components/SuggestedArticles';
import { ArticleCarousel } from '../components/ArticleCarousel';
import { mockPharmacies } from '../data/mockData';

const MOCK_PHARMACIES: Pharmacy[] = mockPharmacies.map(p => ({
  id: String(p.id),
  name: p.name,
  location: p.city,
  rating: p.rating,
  reviews: 0,
  image: p.image,
  distance: '--',
  isOpen: true,
  services: p.services,
  phone: 'Sin teléfono',
  hours: '08:00 AM - 08:00 PM',
  address: 'Av. Principal, Centro Comercial',
  description: `Farmacia ubicada en ${p.city} con servicios de ${p.services.join(', ')}.`
}));

const PHARMACY_BANNERS: CarouselItem[] = [
  {
    id: 'p1',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    title: 'Suplementos y Vitaminas',
    subtitle: 'Refuerza tu sistema inmunológico con nuestras ofertas del mes.'
  },
  {
    id: 'p2',
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
    title: 'Delivery Gratis',
    subtitle: 'En pedidos superiores a $20. ¡Recibe tus medicinas en casa!'
  }
];

interface PharmacyListScreenProps {
  onBack: () => void;
  onSelectPharmacy: (pharmacy: Pharmacy) => void;
  onNavigate: (tab: string) => void;
  initialSearchQuery?: string;
  onNavigateToArticle?: (article: Article) => void;
}

export const PharmacyListScreen: React.FC<PharmacyListScreenProps> = ({
  onBack,
  onSelectPharmacy,
  onNavigate,
  initialSearchQuery = '',
  onNavigateToArticle
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [pharmacies] = useState<Pharmacy[]>(MOCK_PHARMACIES);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLocation, minRating]);

  const locations = ['Todos', 'Caracas', 'Mérida', 'Maracaibo', 'San Cristóbal', 'Valencia', 'Maracay'];

  const filteredPharmacies = pharmacies.filter(pharmacy => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      pharmacy.name.toLowerCase().includes(query) ||
      (pharmacy.inventory && pharmacy.inventory.some(med => med.name.toLowerCase().includes(query)));

    const matchesLocation = selectedLocation === '' || selectedLocation === 'Todos' || pharmacy.location === selectedLocation;
    const matchesRating = pharmacy.rating >= minRating;

    return matchesSearch && matchesLocation && matchesRating;
  });

  const totalPages = Math.ceil(filteredPharmacies.length / itemsPerPage);
  const currentPharmacies = filteredPharmacies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-bg flex flex-col pb-24 transition-colors duration-300">
      <header className="bg-card px-4 py-4 shadow-soft sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-bg rounded-full text-gray-light">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-heading font-bold text-xl text-text-main">Farmacias</h1>
          <button
            onClick={() => setShowFilters(true)}
            className="ml-auto p-2 bg-gray-bg rounded-full text-gray-light hover:bg-primary/10 hover:text-primary transition-colors relative"
          >
            <Filter size={20} />
            {(selectedLocation || minRating > 0) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card"></span>
            )}
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-light" size={18} />
          <input
            type="text"
            placeholder="Buscar farmacia o medicamento..."
            className="w-full pl-10 pr-4 py-3 bg-gray-bg border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none text-text-main placeholder:text-gray-light"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <Carousel items={PHARMACY_BANNERS} />
        </div>

        {initialSearchQuery && (
          <div className="mb-4 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-primary/20">
            <Search size={14} />
            <span>Buscando disponibilidad de: <strong className="text-text-main">{initialSearchQuery}</strong></span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentPharmacies.length > 0 ? (
            <>
              {currentPharmacies.map(pharmacy => (
                <PharmacyCard
                  key={pharmacy.id}
                  pharmacy={pharmacy}
                  onClick={() => onSelectPharmacy(pharmacy)}
                  highlightMedicine={searchQuery}
                />
              ))}
            </>
          ) : (
            <div className="col-span-full text-center py-12 text-gray-light">
              <p>No se encontraron resultados.</p>
              <button
                onClick={() => {
                  setSelectedLocation('');
                  setMinRating(0);
                  setSearchQuery('');
                }}
                className="mt-2 text-primary font-medium text-sm"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

        {filteredPharmacies.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}

        <ArticleCarousel title="Artículos de Opinión" autoSlide={true} onArticleClick={onNavigateToArticle} />
      </div>

      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="fixed bottom-0 left-0 w-full bg-card rounded-t-3xl z-[70] flex flex-col max-h-[80vh] shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center p-6 border-b border-border-main shrink-0">
              <h2 className="font-heading font-bold text-xl text-text-main">Filtros</h2>
              <button onClick={() => setShowFilters(false)} className="p-1 text-gray-light hover:bg-gray-bg rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-text mb-3">Ubicación</label>
                  <div className="flex flex-wrap gap-2">
                    {locations.map(loc => (
                      <button
                        key={loc}
                        onClick={() => setSelectedLocation(loc === 'Todos' ? '' : loc)}
                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-1 ${
                          (selectedLocation === loc || (loc === 'Todos' && selectedLocation === ''))
                            ? 'bg-secondary text-neutral shadow-md'
                            : 'bg-card border border-border-main text-gray-text hover:border-secondary/50'
                        }`}
                      >
                        {loc !== 'Todos' && <MapPin size={12} />}
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-text mb-3">Valoración mínima</label>
                  <div className="flex justify-between bg-gray-bg p-1 rounded-xl">
                    {[0, 3, 4, 4.5].map(rate => (
                      <button
                        key={rate}
                        onClick={() => setMinRating(rate)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          minRating === rate ? 'bg-card shadow-sm text-text-main' : 'text-gray-light'
                        }`}
                      >
                        {rate === 0 ? 'Todas' : `${rate}+ ⭐`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-card p-4 border-t border-border-main shrink-0">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3 rounded-xl bg-primary text-neutral font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
              >
                Aplicar Filtros ({filteredPharmacies.length})
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav activeTab="pharmacy" onTabChange={onNavigate} />
    </div>
  );
};
