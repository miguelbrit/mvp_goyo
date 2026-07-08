import React from 'react';
import { ChevronLeft, MessageCircle, MapPin, Clock, Phone, CheckCircle, XCircle, Star, Truck, Pill, Map } from 'lucide-react';
import { Pharmacy, Article } from '../types';
import { BottomNav } from '../components/BottomNav';
import { SuggestedArticles } from '../components/SuggestedArticles';
import { ArticleCarousel } from '../components/ArticleCarousel';

interface PharmacyProfileScreenProps {
  pharmacy: Pharmacy;
  onBack: () => void;
  onChat: () => void;
  onNavigate: (tab: string) => void;
  onArticleClick?: (article: Article) => void;
}

export const PharmacyProfileScreen: React.FC<PharmacyProfileScreenProps> = ({
  pharmacy,
  onBack,
  onChat,
  onNavigate,
  onArticleClick
}) => {
  const handleOpenMap = () => {
    const query = encodeURIComponent(`${pharmacy.name} ${pharmacy.location}`);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-bg pb-48 transition-colors duration-300">
      {/* Header Image Area */}
      <div className="relative h-64 bg-card flex items-center justify-center overflow-hidden">
        {pharmacy.image ? (
          <img
            src={pharmacy.image}
            alt={pharmacy.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary text-6xl font-bold uppercase">{pharmacy.name.charAt(0)}</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <button
          onClick={onBack}
          className="absolute top-4 left-4 bg-card/90 p-2 rounded-full shadow-sm text-text-main z-10 hover:bg-card transition-colors"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="font-heading text-2xl font-bold mb-2 drop-shadow-md">{pharmacy.name}</h1>
          <div className="flex items-center gap-2 text-sm text-white/90">
            <MapPin size={14} />
            <span>{pharmacy.location}</span>
            <span>•</span>
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span>{pharmacy.rating}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 mt-4 relative z-10 space-y-4">
        {/* Status Card */}
        <div className="bg-card p-4 rounded-2xl shadow-soft flex justify-between items-center border border-border-main">
          <div>
            <p className="text-gray-light text-xs font-bold uppercase tracking-wider mb-1">Horario</p>
            <div className="flex items-center gap-1.5 text-text-main font-medium">
              <Clock size={16} className="text-primary" />
              <span>{pharmacy.hours || 'Horario no registrado'}</span>
            </div>
          </div>
          <div>
            {pharmacy.isOpen ? (
              <span className="bg-green-500/10 text-green-500 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <CheckCircle size={12} /> ABIERTO
              </span>
            ) : (
              <span className="bg-red-500/10 text-red-500 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                <XCircle size={12} /> CERRADO
              </span>
            )}
          </div>
        </div>

        {/* Servicios */}
        {pharmacy.services && pharmacy.services.length > 0 && (
          <div className="bg-card p-4 rounded-2xl shadow-soft border border-border-main">
            <h3 className="font-heading font-bold text-lg text-text-main mb-3 flex items-center gap-2">
              <Pill size={20} className="text-primary" />
              Servicios
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {pharmacy.services.map((service, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-gray-text">
                  <CheckCircle size={16} className="text-green-500 shrink-0" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-card p-4 rounded-2xl shadow-soft space-y-3 border border-border-main">
          <div className="flex items-start gap-3">
            <MapPin className="text-gray-light mt-1 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-text-main">Dirección</p>
              <p className="text-sm text-gray-text leading-relaxed">{pharmacy.address || 'Av. Principal, Centro Comercial'}</p>
              <button
                onClick={handleOpenMap}
                className="mt-2 text-primary text-sm font-semibold flex items-center gap-1 hover:underline"
              >
                <Map size={14} />
                Ver en Mapa
              </button>
            </div>
          </div>
          <div className="h-px bg-border-main"></div>
          <div className="flex items-start gap-3">
            <Phone className="text-gray-light mt-1 shrink-0" size={20} />
            <div>
              <p className="text-sm font-bold text-text-main">Teléfono</p>
              <p className="text-sm text-gray-text">{pharmacy.phone || '0412-000-0000'}</p>
            </div>
          </div>

          {pharmacy.description && (
            <>
              <div className="h-px bg-border-main"></div>
              <div>
                <p className="text-sm font-bold text-text-main">Sobre Nosotros</p>
                <p className="text-sm text-gray-text mt-1">{pharmacy.description}</p>
              </div>
            </>
          )}
        </div>

        {/* Inventory */}
        <div className="pt-2">
          <h3 className="font-heading font-bold text-lg text-text-main mb-3">Medicamentos Disponibles</h3>
          <div className="space-y-3">
            {pharmacy.inventory && pharmacy.inventory.length > 0 ? (
              pharmacy.inventory.map((med) => (
                <div key={med.id} className="bg-card p-3 rounded-xl shadow-sm border border-border-main flex justify-between items-center transition-all hover:border-primary/30">
                  <div>
                    <p className="font-medium text-text-main">{med.name}</p>
                    <p className="text-xs text-gray-light">{med.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">${med.price.toFixed(2)}</p>
                    {med.available ? (
                      <span className="text-[10px] text-green-500 font-medium">En stock</span>
                    ) : (
                      <span className="text-[10px] text-red-400 font-medium">Agotado</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-light text-center text-sm py-4">No hay información de inventario disponible.</p>
            )}
          </div>
        </div>
      </div>

      <ArticleCarousel title="Artículos de Opinión" autoSlide={true} onArticleClick={onArticleClick} />

      {/* Action Bar */}
      <div className="fixed bottom-[64px] left-0 w-full bg-card border-t border-border-main p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] z-40 transition-colors">
        <div className="flex gap-4 max-w-md mx-auto">
          <button
            onClick={onChat}
            className="flex-1 h-14 rounded-2xl bg-primary text-neutral flex items-center justify-center gap-3 text-base font-semibold shadow-xl shadow-primary/30 hover:bg-primary/90 active:scale-95 transition-all"
          >
            <MessageCircle size={22} />
            Iniciar Cotización
          </button>
        </div>
      </div>

      <BottomNav activeTab="pharmacy" onTabChange={onNavigate} />
    </div>
  );
};
