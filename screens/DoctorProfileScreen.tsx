import React from 'react';
import {
  ChevronLeft, MapPin, Star, Award, Users, DollarSign, Calendar, Clock, MessageCircle, Phone
} from 'lucide-react';
import { Doctor, Article } from '../types';
import { BottomNav } from '../components/BottomNav';
import { SuggestedArticles } from '../components/SuggestedArticles';
import { ArticleCarousel } from '../components/ArticleCarousel';

interface DoctorProfileScreenProps {
  doctor: Doctor;
  onBack: () => void;
  onChat: () => void;
  onNavigate: (tab: string) => void;
  onArticleClick?: (article: Article) => void;
}

const TIME_SLOTS = [
  { day: 'Lunes 20 Feb', start: '09:00 AM', end: '10:00 AM' },
  { day: 'Martes 21 Feb', start: '02:00 PM', end: '03:00 PM' },
  { day: 'Jueves 23 Feb', start: '10:00 AM', end: '11:00 AM' },
  { day: 'Viernes 24 Feb', start: '04:00 PM', end: '05:00 PM' },
];

export const DoctorProfileScreen: React.FC<DoctorProfileScreenProps> = ({
  doctor,
  onBack,
  onChat,
  onNavigate,
  onArticleClick
}) => {
  const initials = doctor.name
    .split(' ')
    .filter(n => !n.toLowerCase().includes('.') && n.length > 0)
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  const handleBookSlot = () => {
    alert('Función de agendamiento en desarrollo');
  };

  return (
    <div className="min-h-screen bg-gray-bg pb-48">
      {/* Header Image Area */}
      <div className="relative h-56 bg-secondary">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173bdb999ef?auto=format&fit=crop&q=80&w=1000"
          alt="Medical Office"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-bg"></div>

        <button
          onClick={onBack}
          className="absolute top-6 left-6 bg-white/90 p-2.5 rounded-full shadow-md text-gray-900 z-10 hover:bg-white transition-all transform hover:scale-110 active:scale-95"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      {/* Profile Info Overlay */}
      <div className="px-6 -mt-20 relative z-10 max-w-xl mx-auto">
        <div className="flex justify-between items-end">
          <div className="w-28 h-28 rounded-[2rem] border-4 border-white shadow-xl overflow-hidden bg-white ring-8 ring-primary/5 flex items-center justify-center">
            {doctor.image ? (
              <img src={doctor.image} alt={doctor.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center text-gray-400 relative">
                <Users size={48} className="opacity-40" />
                <span className="absolute bottom-2 text-xs font-bold opacity-30">{initials}</span>
              </div>
            )}
          </div>
          <div className="mb-4">
            <span className="bg-primary text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
              {doctor.specialty}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <h1 className="font-heading text-3xl font-bold text-gray-900 tracking-tight">{doctor.name}</h1>
          <div className="flex items-center gap-4 mt-2 flex-wrap">
            <div className="flex items-center gap-1">
              <MapPin size={16} className="text-primary" />
              <span className="text-gray-500 font-medium text-sm">{doctor.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="text-gray-500 font-medium text-sm">
                {doctor.rating} ({doctor.reviews} reseñas)
              </span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          <div className="bg-white p-4 rounded-2xl text-center shadow-soft border border-white/50">
            <Award size={20} className="mx-auto text-primary mb-1" />
            <span className="block font-bold text-gray-900">{doctor.experience || 0} años</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experiencia</span>
          </div>
          <div className="bg-white p-4 rounded-2xl text-center shadow-soft border border-white/50">
            <Users size={20} className="mx-auto text-blue-500 mb-1" />
            <span className="block font-bold text-gray-900">{doctor.patients}+</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pacientes</span>
          </div>
          <div className="bg-white p-4 rounded-2xl text-center shadow-soft border border-white/50">
            <DollarSign size={20} className="mx-auto text-green-500 mb-1" />
            <span className="block font-bold text-gray-900">${doctor.price}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Consulta</span>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-8">
          <h3 className="font-heading font-bold text-xl text-gray-900 mb-3">Sobre el médico</h3>
          <p className="text-gray-600 text-sm leading-relaxed font-medium">
            {doctor.about || `Especialista en ${doctor.specialty} con amplia experiencia y dedicación al bienestar de sus pacientes.`}
          </p>
        </div>

        {/* Próximas Citas Disponibles */}
        <div className="mt-8">
          <h3 className="font-heading font-bold text-xl text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={22} className="text-primary" />
            Próximas Citas Disponibles
          </h3>
          <div className="space-y-3">
            {TIME_SLOTS.map((slot, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-soft border border-white/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{slot.day}</p>
                    <p className="text-xs text-gray-500">{slot.start} - {slot.end}</p>
                  </div>
                </div>
                <button
                  onClick={handleBookSlot}
                  className="px-4 py-2 bg-primary text-neutral text-sm font-semibold rounded-xl hover:bg-primary/90 active:scale-95 transition-all shadow-md shadow-primary/20"
                >
                  Agendar
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ArticleCarousel title="Artículos de Opinión" autoSlide={true} onArticleClick={onArticleClick} />

      {/* Floating Action Bar */}
      <div className="fixed bottom-[74px] left-0 w-full p-6 z-40">
        <div className="max-w-md mx-auto flex gap-4">
          <button
            onClick={onChat}
            className="w-16 h-16 rounded-2xl bg-white border-2 border-primary/10 text-primary flex items-center justify-center shadow-lg hover:bg-primary/5 transition-all"
          >
            <MessageCircle size={28} />
          </button>
          <a
            href={`https://wa.me/584141234567?text=Hola%20${encodeURIComponent(doctor.name)}%2C%20quiero%20agendar%20una%20cita`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-16 rounded-2xl bg-primary text-neutral flex items-center justify-center gap-3 text-lg font-semibold shadow-2xl shadow-primary/40 hover:bg-primary/90 active:scale-95 transition-all"
          >
            <Phone size={22} />
            Contactar por WhatsApp
          </a>
        </div>
      </div>

      <BottomNav activeTab="doctors" onTabChange={onNavigate} />
    </div>
  );
};
