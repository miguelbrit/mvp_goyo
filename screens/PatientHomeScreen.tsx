import React, { useState } from 'react';
import { MapPin, Send, Pill, Activity, ClipboardCheck, Mic } from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Carousel, CarouselItem } from '../components/Carousel';
import { InterestCarousel } from '../components/InterestCarousel';
import { BottomNav } from '../components/BottomNav';
import { Sidebar } from '../components/Sidebar';
import { SuggestedArticles } from '../components/SuggestedArticles';
import { Article } from '../types';

interface PatientHomeScreenProps {
  userName?: string;
  userProfile?: any;
  onLogout: () => void;
  onProfileUpdate?: () => void;
  onNavigateToChat: (initialMessage?: string) => void;
  onNavigateToMedicines: () => void;
  onNavigateToPathologies: () => void;
  onNavigateToPreOp: () => void;
  onNavigate: (tab: string) => void; // For BottomNav
  onSelectArticle: (article: Article) => void;
  onNavigateToMasterDashboard?: () => void;
}

export const PatientHomeScreen: React.FC<PatientHomeScreenProps> = ({ 
  userName = "Usuario", 
  userProfile,
  onLogout, 
  onProfileUpdate,
  onNavigateToChat,
  onNavigateToMedicines,
  onNavigateToPathologies,
  onNavigateToPreOp,
  onNavigate,
  onSelectArticle,
  onNavigateToMasterDashboard
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [message, setMessage] = useState('');

  const patientData = userProfile?.patient || {};
  const city = patientData.city || "Ciudad no especificada";
  
  const calculateAge = (birthday: string) => {
    if (!birthday) return null;
    const ageDifMs = Date.now() - new Date(birthday).getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(patientData.birthDate);

  // Reorganized cards according to new requirements
  const interestItems = [
    { 
      id: 'medicines', 
      icon: Pill, 
      label: 'Medicamentos', 
      color: 'text-blue-600 bg-blue-50', 
      action: onNavigateToMedicines 
    },
    { 
      id: 'pathologies', 
      icon: Activity, 
      label: 'Patologías', 
      color: 'text-teal-600 bg-teal-50', 
      action: onNavigateToPathologies 
    },
    { 
      id: 'preop', 
      icon: ClipboardCheck, 
      label: 'Listas Pre Operatoria', 
      color: 'text-orange-600 bg-orange-50', 
      action: onNavigateToPreOp 
    },
  ];

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

  const handleBannerClick = (item: CarouselItem) => {
    console.log("Navegando a home desde banner:", item.title);
  };

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
          <div>
            <h1 className="font-heading text-lg text-gray-text truncate max-w-[70%]">
              Hola, <span className="font-bold text-secondary">{userName}</span>
            </h1>
            {onNavigateToMasterDashboard && (
              <button
                onClick={onNavigateToMasterDashboard}
                className="text-xs font-bold text-[#0D9488] hover:text-[#0D9488]/80 underline underline-offset-2 mt-0.5"
              >
                Master Dashboard
              </button>
            )}
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="flex-shrink-0">
            <Avatar 
              src={userProfile?.imageUrl} 
              alt={userName} 
              size="md" 
            />
          </button>
        </div>
        
        <div className="flex items-center gap-1.5 text-gray-light text-sm font-medium">
          <MapPin size={15} className="text-primary" />
          <span>{city}, Venezuela</span>
        </div>
      </header>

      <main className="px-6 py-6 space-y-6">
        
        {/* Health Overview Card (Linked to Dr. Goyo AI) */}

         {/* Chat Section */}
         <section>
           <div className="w-full min-h-[200px] bg-[#0D9488] rounded-3xl p-6 shadow-lg shadow-teal-900/20 flex flex-col justify-between">
             <div className="text-white font-medium mb-4">
               👋 Hola, bienvenido a Dr. Goyo. ¿Qué molestia tienes hoy?
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
            onItemClick={handleBannerClick}
          />
        </section>

        {/* "Te puede Interesar" - Versión Experimental Glassmorphism */}
        <section>
          <div className="flex items-center justify-between mb-2 px-6">
            <h2 className="font-heading font-extrabold text-cyan-900 dark:text-white text-xl tracking-tight">Servicios Médicos</h2>
            <div className="flex gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest">Premium</span>
            </div>
          </div>
          
          <div className="mt-1">
            <InterestCarousel 
              onNavigateToMedicines={onNavigateToMedicines}
              onNavigateToPathologies={onNavigateToPathologies}
              onNavigateToPreOp={onNavigateToPreOp}
            />
          </div>
        </section>

        {/* 
        DISEÑO ANTERIOR (ROLLBACK) - Grid de botones verticales
        <section>
          <h2 className="font-heading font-semibold text-text-main mb-3 text-lg">Te puede Interesar</h2>
          <div className="grid grid-cols-1 gap-3">
            {interestItems.map((item) => (
              <button 
                key={item.id}
                onClick={item.action}
                className="bg-card p-4 rounded-2xl shadow-soft flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98] group border border-transparent hover:border-border-main text-left"
              >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform flex-shrink-0`}>
                  <item.icon size={26} />
                </div>
                <div>
                   <h3 className="font-bold text-text-main text-base group-hover:text-primary transition-colors">{item.label}</h3>
                   <p className="text-xs text-gray-light mt-0.5">Accede a información verificada</p>
                </div>
              </button>
            ))}
          </div>
        </section>
        */}

         {/* Recommended Readings Section */}
         <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
            <div className="flex items-center justify-between mb-2">
               <h2 className="font-heading font-semibold text-text-main text-lg">Artículos de Opinión</h2>
            </div>
            
               <SuggestedArticles section={"general" as any} onArticleClick={onSelectArticle} autoSlide={true} />
         </section>

      </main>

      <BottomNav activeTab="home" onTabChange={onNavigate} />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        userName={userName}
        userImage={userProfile?.imageUrl}
        userProfile={userProfile}
        onProfileUpdate={onProfileUpdate}
        onLogout={onLogout}
      />
    </div>
  );
};