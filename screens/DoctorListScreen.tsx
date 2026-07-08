import React, { useState, useEffect } from 'react';
import { Filter, ChevronLeft, Search, MapPin, X } from 'lucide-react';
import { DoctorCard } from '../components/DoctorCard';
import { Article, Doctor } from '../types';
import { BottomNav } from '../components/BottomNav';
import { Pagination } from '../components/Pagination';
import { Carousel, CarouselItem } from '../components/Carousel';
import { SuggestedArticles } from '../components/SuggestedArticles';
import { ArticleCarousel } from '../components/ArticleCarousel';
import { mockDoctors } from '../data/mockData';

const MOCK_DOCTORS: Doctor[] = mockDoctors.map(doc => ({
  id: String(doc.id),
  name: doc.name,
  specialty: doc.specialty,
  location: doc.city,
  distance: '--',
  rating: doc.rating,
  reviews: doc.reviews,
  price: 50,
  image: doc.image,
  nextAvailable: 'Disponible',
  isFeatured: doc.rating >= 4.8,
  about: doc.bio,
  experience: doc.experience,
  patients: doc.patients
}));

// Banner Data for Doctors
const DOCTOR_BANNERS: CarouselItem[] = [
  {
    id: 'd1',
    image: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=800',
    title: 'Seguros Médicos',
    subtitle: 'Conoce los especialistas afiliados a tu póliza de seguro.'
  },
  {
    id: 'd2',
    image: '/imagenes/telemedicina.jpg',
    title: 'Telemedicina',
    subtitle: 'Consulta con médicos certificados desde la comodidad de tu hogar.'
  }
];

interface DoctorListScreenProps {
  onBack: () => void;
  onSelectDoctor: (doctor: Doctor) => void;
  initialOpenFilters?: boolean;
  onNavigate: (tab: string) => void;
  initialSearchQuery?: string;
  initialSpecialty?: string;
  onNavigateToArticle?: (article: Article) => void; // New Prop
}

export const DoctorListScreen: React.FC<DoctorListScreenProps> = ({ 
  onBack, 
  onSelectDoctor,
  initialOpenFilters = false,
  onNavigate,
  initialSearchQuery = '',
  initialSpecialty = '',
  onNavigateToArticle
}) => {
  const [showFilters, setShowFilters] = useState(initialOpenFilters);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [doctors] = useState<Doctor[]>(MOCK_DOCTORS);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSpecialty, selectedLocation, minRating]);

  // Filter Options
  const specialties = [
    'Todos', 
    'Cardiología', 
    'Ginecología', 
    'Pediatría', 
    'Dermatología', 
    'Traumatología', 
    'Medicina Interna'
  ];
  const locations = [
    'Todos', 
    'Caracas', 
    'Mérida', 
    'Maracaibo', 
    'San Cristóbal', 
    'Valencia', 
    'Maracay'
  ];

  // Apply filters
  const filteredDoctors = doctors.filter(doc => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(query) || 
                          doc.specialty.toLowerCase().includes(query);
    const matchesSpecialty = selectedSpecialty === '' || selectedSpecialty === 'Todos' || doc.specialty === selectedSpecialty;
    const matchesLocation = selectedLocation === '' || selectedLocation === 'Todos' || doc.location === selectedLocation;
    const matchesRating = doc.rating >= minRating;

    return matchesSearch && matchesSpecialty && matchesLocation && matchesRating;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-bg flex flex-col pb-24">
      {/* Header */}
      <header className="bg-card px-4 py-4 shadow-soft sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-bg rounded-full text-gray-light">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-heading font-bold text-xl text-text-main">Médicos Disponibles</h1>
          <button 
            onClick={() => setShowFilters(true)}
            className="ml-auto p-2 bg-gray-bg rounded-full text-gray-light hover:bg-primary/10 hover:text-primary transition-colors relative"
          >
            <Filter size={20} />
            {(selectedSpecialty || selectedLocation || minRating > 0) && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-card"></span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-light" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por nombre o especialidad..." 
            className="w-full pl-10 pr-4 py-3 bg-gray-bg border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none text-text-main placeholder:text-gray-light"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      {/* List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        
        {/* --- ADVERTISING BANNER --- */}
        <div className="mb-4">
          <Carousel items={DOCTOR_BANNERS} />
        </div>

        {(initialSearchQuery || initialSpecialty) && (
           <div className="mb-4 bg-primary/10 text-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <Search size={14} />
              <span>
                Filtros activos: 
                {initialSearchQuery && <strong> {initialSearchQuery} </strong>}
                {initialSpecialty && <strong> {initialSpecialty} </strong>}
              </span>
           </div>
        )}
        
        {currentDoctors.length > 0 ? (
          <>
            {currentDoctors.map(doctor => (
              <DoctorCard 
                key={doctor.id} 
                doctor={doctor} 
                onClick={() => onSelectDoctor(doctor)}
                onBook={() => onSelectDoctor(doctor)}
              />
            ))}
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12 text-gray-light">
            <p>Aún no hay médicos disponibles en tu zona.</p>
            <p className="text-xs mt-1">¡Pronto más profesionales!</p>
            <button 
              onClick={() => {
                setSelectedSpecialty('');
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

         {/* SUGGESTED ARTICLES BANNER */}
         <ArticleCarousel title="Artículos de Opinión" autoSlide={true} onArticleClick={onNavigateToArticle} />
        
      </div>

      {/* Filter Modal - Fixed Layout */}
      {showFilters && (
        <>
          <div className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="fixed bottom-0 left-0 w-full bg-card rounded-t-3xl z-[70] flex flex-col max-h-[80vh] shadow-2xl animate-in slide-in-from-bottom duration-300">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-border-main shrink-0">
              <h2 className="font-heading font-bold text-xl text-text-main">Filtros</h2>
              <button onClick={() => setShowFilters(false)} className="p-1 text-gray-light hover:bg-gray-bg rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-6">
                {/* Specialty */}
                <div>
                  <label className="block text-sm font-bold text-gray-text mb-3">Especialidad</label>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map(spec => (
                      <button
                        key={spec}
                        onClick={() => setSelectedSpecialty(spec === 'Todos' ? '' : spec)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          (selectedSpecialty === spec || (spec === 'Todos' && selectedSpecialty === ''))
                            ? 'bg-primary text-neutral shadow-md shadow-primary/30'
                            : 'bg-gray-bg text-gray-text hover:bg-gray-200/50'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
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

                {/* Rating */}
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

            {/* Fixed Bottom Button */}
            <div className="sticky bottom-0 bg-card p-4 border-t border-border-main shrink-0">
              <button 
                onClick={() => setShowFilters(false)}
                className="w-full py-3 rounded-xl bg-primary text-neutral font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform"
              >
                Aplicar Filtros ({filteredDoctors.length})
              </button>
            </div>
          </div>
        </>
      )}

      <BottomNav activeTab="doctors" onTabChange={onNavigate} />
    </div>
  );
};