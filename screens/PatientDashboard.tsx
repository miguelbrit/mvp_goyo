import React, { useState } from 'react';
import { MapPin, Send, Pill, Activity, ClipboardCheck, Mic, User, Stethoscope, Building2, BookOpen } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Carousel, CarouselItem } from '../components/Carousel';
import { BottomNav } from '../components/BottomNav';

const userMock = {
  name: "Carlos Pérez",
  email: "carlos.demo@gmail.com",
  role: "paciente",
  avatar: "https://ui-avatars.com/api/?name=Carlos+Perez&background=0D9488&color=fff"
};

const patientDataMock = {
  city: "Caracas",
  birthDate: "1985-03-20",
  gender: "Masculino",
  weight: 75,
  height: 178,
  bloodType: "A+",
  allergies: "Ninguna"
};

interface PatientDashboardProps {
  onLogout?: () => void;
  onNavigateToChat: (initialMessage?: string) => void;
  onNavigateToMedicines: () => void;
  onNavigateToPathologies: () => void;
  onNavigateToPreOp: () => void;
  onNavigate: (tab: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onLogout,
  onNavigateToChat,
  onNavigateToMedicines,
  onNavigateToPathologies,
  onNavigateToPreOp,
  onNavigate
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');

  const bannerItems: CarouselItem[] = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
      title: 'Tu Salud Primero',
      subtitle: 'Agenda citas con los mejores especialistas de la ciudad.'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
      title: 'Farmacia Express',
      subtitle: 'Medicamentos a domicilio en menos de 45 minutos.'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800',
      title: 'Laboratorio Clínico',
      subtitle: 'Resultados confiables y seguros directamente en tu perfil.'
    }
  ];

  const calculateAge = (birthday: string) => {
    if (!birthday) return null;
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(patientDataMock.birthDate);

  const handleChatInputSubmit = () => {
    if (message.trim()) {
      onNavigateToChat(message);
      setMessage('');
    } else {
      onNavigateToChat();
    }
  };

  return (
    <div className="min-h-screen bg-gray-bg pb-24">
      {/* Header */}
      <header className="bg-card px-6 pt-6 pb-4 rounded-b-3xl shadow-soft sticky top-0 z-30">
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-heading text-lg text-gray-text truncate max-w-[70%]">
            Hola, <span className="font-bold text-secondary">{userMock.name}</span>
          </h1>
          <button onClick={() => setIsSidebarOpen(true)} className="flex-shrink-0">
            <Avatar 
              src={userMock.avatar} 
              alt={userMock.name} 
              size="md" 
            />
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-light text-sm font-medium">
          <MapPin size={15} className="text-primary" />
          <span>{patientDataMock.city}, Venezuela</span>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
         {/* Chat Section */}
         <section>
           <div className="w-full min-h-[200px] bg-[#0D9488] rounded-3xl p-6 shadow-lg shadow-teal-900/20 flex flex-col justify-between">
             <div className="text-white font-medium mb-4">
               👋 Hola, soy tu asistente de salud. ¿Qué molestia tienes hoy?
             </div>
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Escribe aquí tus síntomas..." 
                 className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pr-12 text-white placeholder-white/60 focus:outline-none focus:bg-white/20 transition-all"
                 value={message}
                 onChange={(e) => setMessage(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleChatInputSubmit()}
               />
               {message.length > 0 ? (
                 <button 
                   onClick={handleChatInputSubmit}
                   className="absolute right-2 top-2 p-1.5 bg-white rounded-lg text-[#0D9488] hover:bg-gray-100 transition-all"
                 >
                   <Send size={18} />
                 </button>
               ) : (
                 <button 
                   onClick={() => onNavigateToChat()}
                   className="absolute right-2 top-2 p-1.5 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-all"
                 >
                   <Mic size={18} />
                 </button>
               )}
             </div>
           </div>
         </section>

        {/* Carousel Banner */}
        <section>
          <Carousel 
            items={bannerItems} 
            onItemClick={() => {}}
          />
        </section>

        {/* Orientation Bar */}
        <section className="bg-white rounded-2xl p-4 shadow-soft border border-border-main">
          <h2 className="font-heading font-semibold text-text-main mb-3 text-lg">¿Qué necesitas?</h2>
          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={() => onNavigateToChat()}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-teal-50 flex items-center justify-center">
                <Stethoscope size={24} className="text-primary" />
              </div>
              <span className="text-[11px] font-medium text-secondary text-center">Directorio Médico</span>
            </button>
            
            <button 
              onClick={onNavigateToMedicines}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Pill size={24} className="text-blue-600" />
              </div>
              <span className="text-[11px] font-medium text-secondary text-center">Medicamentos</span>
            </button>
            
            <button 
              onClick={() => onNavigate('labs')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <Building2 size={24} className="text-emerald-600" />
              </div>
              <span className="text-[11px] font-medium text-secondary text-center">Laboratorios</span>
            </button>
            
            <button 
              onClick={() => onNavigate('library_hub')}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:scale-95 transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center">
                <BookOpen size={24} className="text-violet-600" />
              </div>
              <span className="text-[11px] font-medium text-secondary text-center">Biblioteca</span>
            </button>
          </div>
        </section>

        {/* Health Overview Card */}
        <section>
          <div className="bg-white rounded-2xl p-4 shadow-soft border border-border-main">
            <h2 className="font-heading font-semibold text-text-main mb-3 text-lg">Resumen de Salud</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-light">Edad</p>
                <p className="font-bold text-secondary text-lg">{age} años</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-light">Tipo de Sangre</p>
                <p className="font-bold text-secondary text-lg">{patientDataMock.bloodType}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-light">Altura</p>
                <p className="font-bold text-secondary text-lg">{patientDataMock.height} cm</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-light">Peso</p>
                <p className="font-bold text-secondary text-lg">{patientDataMock.weight} kg</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BottomNav activeTab="home" onTabChange={onNavigate} />
    </div>
  );
};