import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, Calendar, Clock, MessageSquare, Settings, LogOut, 
  Bell, Menu, Edit, Phone, Mail, MapPin, Loader2, CheckCircle, Search, Plus, Filter,
  ShieldAlert, Eye, EyeOff, Save, Trash2, CalendarPlus, UserCheck, Check, X, FileText,
  CalendarDays
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { ArticleCarousel } from '../components/ArticleCarousel';

interface StatItem {
  label: string;
  value: string;
  icon: any;
  color: string;
}

const StatCard: React.FC<{ item: StatItem }> = ({ item }) => (
  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color}`}>
      <item.icon size={24} />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{item.label}</p>
      <h3 className="text-2xl font-heading font-bold text-gray-900">{item.value}</h3>
    </div>
  </div>
);

interface DoctorDashboardProps {
  onLogout?: () => void;
  userName?: string;
  userProfile?: any;
  onProfileUpdate?: () => void;
}

type DashboardView = 'overview' | 'patients' | 'appointments' | 'settings';

const MOCK_DOCTOR = {
  name: "Dr. Alejandro Mendoza",
  specialty: "Cardiología",
  city: "Caracas",
  email: "alejandro.mendoza@drgoyo.com",
  phone: "0212-555-4321",
  imageUrl: "https://randomuser.me/api/portraits/men/32.jpg",
  stats: { patients: 24, appointmentsToday: 5, pending: 2 }
};

const INITIAL_REQUESTS = [
  { id: 1, patient: "Carlos Pérez", date: "26 Jun", time: "10:00 AM", reason: "Dolor de pecho recurrente", status: "pending", image: "https://randomuser.me/api/portraits/men/44.jpg" },
  { id: 2, patient: "Sofia L.", date: "26 Jun", time: "11:30 AM", reason: "Control rutinario", status: "confirmed", image: "https://randomuser.me/api/portraits/women/22.jpg" },
  { id: 3, patient: "Juan Medina", date: "27 Jun", time: "09:00 AM", reason: "Resultados de análisis de laboratorio", status: "rejected", image: "https://randomuser.me/api/portraits/men/85.jpg" },
  { id: 4, patient: "Maria Rodriguez", date: "28 Jun", time: "08:30 AM", reason: "Arritmia leve ocasional", status: "pending", image: "https://randomuser.me/api/portraits/women/45.jpg" },
];

const mockPatients = [
  { id: 1, name: "Carlos Pérez", age: 45, lastVisit: "15 Feb 2026", image: "https://randomuser.me/api/portraits/men/44.jpg", history: "Hipertensión arterial diagnosticada en 2024. Controlada.", allergies: "Penicilina", prescriptions: ["Losartán 50mg (1/día)", "Aspirina 81mg (1/día)"], notes: "Monitoreo mensual de presión sistólica. Mantener dosis actuales." },
  { id: 2, name: "Maria Rodriguez", age: 32, lastVisit: "10 Feb 2026", image: "https://randomuser.me/api/portraits/women/45.jpg", history: "Control post-operatorio de ablación cardíaca menor. Sin arritmias reportadas.", allergies: "Ninguna", prescriptions: ["Hierro Aminoquelado 300mg (1/día)"], notes: "Solicitar nuevo holter de control para evaluar actividad eléctrica." },
  { id: 3, name: "Juan Medina", age: 50, lastVisit: "22 Ene 2026", image: "https://randomuser.me/api/portraits/men/85.jpg", history: "Diabetes Mellitus Tipo II. Control metabólico estable.", allergies: "Polen, Mariscos", prescriptions: ["Metformina 850mg (2/día con comidas)"], notes: "Solicitar perfil lipídico completo y hemoglobina glicosilada (HbA1c)." },
  { id: 4, name: "Sofia L.", age: 28, lastVisit: "08 Feb 2026", image: "https://randomuser.me/api/portraits/women/22.jpg", history: "Migraña crónica. Evaluada para descartar causas circulatorias secundarias.", allergies: "Aspirina", prescriptions: ["Ibuprofeno 400mg (si presenta crisis dolorosas)"], notes: "Recomendar evitar cafeína y mantener buena higiene del sueño." },
  { id: 5, name: "Pedro Gomez", age: 60, lastVisit: "05 Ene 2026", image: "https://randomuser.me/api/portraits/men/29.jpg", history: "Cardiopatía isquémica con stent coronario colocado en 2023.", allergies: "Sulfas", prescriptions: ["Atorvastatina 20mg (1/noche)", "Clopidogrel 75mg (1/día)"], notes: "Paciente asintomático. Próxima prueba de esfuerzo en seis meses." },
  { id: 6, name: "Laura Díaz", age: 37, lastVisit: "19 Ene 2026", image: "https://randomuser.me/api/portraits/women/68.jpg", history: "Insuficiencia venosa periférica leve. Várices superficiales.", allergies: "Ninguna", prescriptions: ["Daflon 500mg (2/día)"], notes: "Evitar sedentarismo prolongado y aconsejar uso de medias de compresión." },
];

const timeSlots = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"];

export const DoctorDashboardScreen: React.FC<DoctorDashboardProps> = ({ 
  onLogout, 
  userName = "Dr. Alejandro Mendoza", 
  userProfile 
}) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [profile, setProfile] = useState({
    ...MOCK_DOCTOR,
    ...userProfile,
    imageUrl: userProfile?.imageUrl || userProfile?.doctor?.imageUrl || MOCK_DOCTOR.imageUrl
  });
  
  // Real State Management for Mock Pipeline
  const [appointmentRequests, setAppointmentRequests] = useState(INITIAL_REQUESTS);
  
  // Modal State for Patient History
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null);

  // Settings Form State
  const [formData, setFormData] = useState({
    name: profile.name,
    specialty: profile.specialty,
    city: profile.city,
    email: profile.email,
    phone: profile.phone,
    currentPassword: '',
    newPassword: '',
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Agenda Pipeline Tab State
  const [agendaTab, setAgendaTab] = useState<'pending' | 'confirmed' | 'rejected'>('pending');

  // Availability Scheduler State (Date & Time slots)
  const todayDateString = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayDateString);
  const [availability, setAvailability] = useState<Record<string, string[]>>({
    [todayDateString]: ["09:00 AM", "10:00 AM", "02:00 PM"],
  });

  const handleToggleSlot = (slot: string) => {
    const currentSlots = availability[selectedDate] || [];
    let newSlots;
    if (currentSlots.includes(slot)) {
      newSlots = currentSlots.filter(s => s !== slot);
    } else {
      newSlots = [...currentSlots, slot];
    }
    setAvailability(prev => ({
      ...prev,
      [selectedDate]: newSlots
    }));
  };

  const handleSaveAvailability = () => {
    alert('Horario actualizado para el día seleccionado');
  };

  const handleStatusChange = (id: number, newStatus: 'confirmed' | 'rejected') => {
    setAppointmentRequests(prev => 
      prev.map(req => req.id === id ? { ...req, status: newStatus } : req)
    );
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile(prev => ({
      ...prev,
      name: formData.name,
      specialty: formData.specialty,
      city: formData.city,
      email: formData.email,
      phone: formData.phone,
    }));
    alert('Perfil actualizado correctamente');
  };

  // Re-calculate stats dynamically based on status changes
  const activePatients = mockPatients.length;
  const appointmentsTodayCount = appointmentRequests.filter(req => req.status === 'confirmed').length;
  const pendingRequestsCount = appointmentRequests.filter(req => req.status === 'pending').length;

  const stats = [
    { label: 'Pacientes Activos', value: String(activePatients), icon: Users, color: 'bg-teal-50 text-[#0D9488]' },
    { label: 'Citas Confirmadas', value: String(appointmentsTodayCount), icon: Calendar, color: 'bg-blue-50 text-blue-600' },
    { label: 'Solicitudes Pendientes', value: String(pendingRequestsCount), icon: Clock, color: 'bg-orange-50 text-orange-600' },
  ];

  const recentActivity = [
    { id: 1, text: "Cita con Carlos Pérez - 10:00 AM", type: 'appointment', time: 'Hace 10 min' },
    { id: 2, text: "Receta enviada a Farmacia El Sol - Ayer", type: 'prescription', time: 'Ayer' },
    { id: 3, text: "Resultado de laboratorio recibido - Hace 2 horas", type: 'lab_result', time: 'Hace 2 horas' },
    { id: 4, text: "Nueva solicitud de cita de Sofia L. - Pendiente", type: 'request', time: 'Hace 3 horas' },
  ];

  const SidebarItem = ({ id, icon: Icon, label }: { id: DashboardView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentView === id
          ? 'bg-[#0D9488] text-white shadow-lg shadow-[#0D9488]/30'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-bg flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-[#0D9488]">
              <Calendar size={24} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-gray-900">Dr. Goyo</h1>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Médicos</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem id="appointments" icon={Calendar} label="Agenda de Citas" />
            <SidebarItem id="patients" icon={Users} label="Mis Pacientes" />
            <SidebarItem id="settings" icon={Settings} label="Configuración" />
          </nav>

          {/* Logout Button */}
          {onLogout && (
            <div className="pt-6 border-t border-gray-100">
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Container */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="block">
              <h2 className="text-xl font-heading font-bold text-gray-800">{profile.name}</h2>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <MapPin size={12} className="text-[#0D9488]" />
                <span>{profile.specialty} • {profile.city}, Venezuela</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Availability State */}
            <div className="hidden md:flex items-center gap-3 bg-gray-100 p-1 rounded-full">
              <button
                onClick={() => setIsAvailable(true)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isAvailable ? 'bg-white text-[#0D9488] shadow-sm' : 'text-gray-500'}`}
              >
                Operativo
              </button>
              <button
                onClick={() => setIsAvailable(false)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isAvailable ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500'}`}
              >
                Ausente
              </button>
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <Avatar src={profile.imageUrl || ''} alt="Doctor" size="md" />
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* VIEW: OVERVIEW */}
          {currentView === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Summary Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <StatCard key={idx} item={stat} />
                ))}
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Today's Appointments & Availability Scheduler */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Today's Appointments */}
                  <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-heading font-bold text-lg text-gray-900">Agenda de Hoy</h3>
                      <button onClick={() => setCurrentView('appointments')} className="text-[#0D9488] text-sm font-medium hover:underline">Ver agenda completa</button>
                    </div>
                    
                    <div className="divide-y divide-gray-100">
                      {appointmentRequests.filter(req => req.status === 'confirmed').length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">
                          No tienes citas confirmadas programadas para hoy.
                        </div>
                      ) : (
                        appointmentRequests.filter(req => req.status === 'confirmed').slice(0, 4).map((apt) => (
                          <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                            <div className="flex items-center gap-4">
                              <Avatar src={apt.image} alt={apt.patient} size="sm" />
                              <div>
                                <p className="font-bold text-gray-900">{apt.patient}</p>
                                <p className="text-xs text-gray-500">{apt.reason}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="text-sm font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                                {apt.time}
                              </div>
                              <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-teal-50 text-[#0D9488]">
                                Confirmada
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Weekly availability hour scheduler */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="text-[#0D9488]" size={22} />
                        <div>
                          <h3 className="font-heading font-bold text-lg text-gray-900">Mi Disponibilidad Semanal</h3>
                          <p className="text-xs text-gray-500">Configura tus horas de atención por fecha.</p>
                        </div>
                      </div>
                      
                      {/* Date Selector */}
                      <input 
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 text-gray-800 bg-slate-50 font-medium"
                      />
                    </div>
                    
                    {/* Time Slots Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                      {timeSlots.map((slot) => {
                        const isSelected = (availability[selectedDate] || []).includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => handleToggleSlot(slot)}
                            className={`min-h-[44px] py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5
                              ${isSelected 
                                ? 'bg-teal-50 text-[#0D9488] border-[#0D9488] shadow-sm' 
                                : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-gray-300'
                              }
                            `}
                          >
                            {isSelected && <Check size={14} className="shrink-0" />}
                            {slot}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex justify-end border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={handleSaveAvailability}
                        className="px-5 py-2.5 bg-[#0D9488] hover:bg-[#0d9488]/95 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-[#0D9488]/10 transition-colors"
                      >
                        <Save size={16} />
                        Guardar Disponibilidad
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right Side: Doctor Profile Summary & Recent Activities */}
                <div className="space-y-6">
                  {/* Doctor Profile Brief */}
                  <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100 text-center flex flex-col items-center">
                    <div className="relative mb-4">
                      <Avatar src={profile.imageUrl || ''} alt={profile.name} size="lg" />
                      <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900">{profile.name}</h3>
                    <p className="text-xs text-[#0D9488] font-bold uppercase tracking-wider mt-0.5">{profile.specialty}</p>
                    
                    <div className="w-full border-t border-gray-100 my-4"></div>
                    
                    <div className="w-full text-left space-y-3 mb-6">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <MapPin size={16} className="text-gray-400 shrink-0" />
                        <span>Caracas, Venezuela</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Phone size={16} className="text-gray-400 shrink-0" />
                        <span>{profile.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <Mail size={16} className="text-gray-400 shrink-0" />
                        <span className="truncate">{profile.email}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => setCurrentView('settings')}
                      className="w-full py-2.5 bg-slate-50 text-[#0D9488] border border-[#0D9488]/20 rounded-xl text-sm font-semibold hover:bg-teal-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit size={16} />
                      Editar Perfil
                    </button>
                  </div>

                   {/* Recent Activity Card */}
                   <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                     <h3 className="font-heading font-bold text-lg text-gray-900 mb-4">Actividad Reciente</h3>
                     <div className="space-y-4">
                       {recentActivity.map((activity) => (
                         <div key={activity.id} className="flex gap-3 items-start text-sm">
                           <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488] mt-2 shrink-0"></div>
                           <div>
                             <p className="text-gray-700 font-medium leading-snug">{activity.text}</p>
                             <span className="text-[10px] text-gray-400 mt-1 block">{activity.time}</span>
                           </div>
                         </div>
                       ))}
                     </div>
                   </div>

                   {/* Article Carousel */}
                   <ArticleCarousel title="Artículos de Opinión" autoSlide={true} />
                 </div>
               </div>
             </div>
           )}

          {/* VIEW: APPOINTMENTS PIPELINE */}
          {currentView === 'appointments' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Agenda de Citas</h2>
                <p className="text-sm text-gray-500">Gestión y aprobación de solicitudes de consultas</p>
              </div>

              {/* Tabs & Filters */}
              <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
                  <button 
                    onClick={() => setAgendaTab('pending')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${agendaTab === 'pending' ? 'bg-orange-500 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                    Pendientes ({appointmentRequests.filter(req => req.status === 'pending').length})
                  </button>
                  <button 
                    onClick={() => setAgendaTab('confirmed')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${agendaTab === 'confirmed' ? 'bg-green-600 text-white shadow' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                    Confirmadas ({appointmentRequests.filter(req => req.status === 'confirmed').length})
                  </button>
                  <button 
                    onClick={() => setAgendaTab('rejected')}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${agendaTab === 'rejected' ? 'bg-red-50 text-red-500 shadow' : 'text-gray-500 hover:text-gray-800'}`}
                  >
                    Rechazadas ({appointmentRequests.filter(req => req.status === 'rejected').length})
                  </button>
                </div>

                <div className="flex gap-2">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Buscar solicitud..." 
                      className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 w-44 md:w-56"
                    />
                  </div>
                </div>
              </div>

              {/* Solicitudes List Grid */}
              {appointmentRequests.filter(req => req.status === agendaTab).length === 0 ? (
                <div className="bg-white p-12 text-center text-gray-400 border border-dashed border-gray-200 rounded-2xl">
                  No hay solicitudes en esta sección.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {appointmentRequests.filter(req => req.status === agendaTab).map((apt) => (
                    <div key={apt.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft hover:shadow-md transition-shadow flex flex-col justify-between h-48">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <Avatar src={apt.image} alt={apt.patient} size="md" />
                          <div>
                            <h4 className="font-bold text-gray-900 text-base">{apt.patient}</h4>
                            <p className="text-xs text-[#0D9488] font-semibold">{apt.reason}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                          apt.status === 'confirmed' ? 'bg-green-50 text-green-700' :
                          apt.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {apt.status === 'confirmed' ? 'Confirmada' : apt.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 p-2 rounded-xl border border-gray-100 w-fit">
                        <Clock size={14} className="text-[#0D9488]" />
                        <span className="font-semibold">{apt.date} • {apt.time}</span>
                      </div>

                      {/* Pending state approval buttons */}
                      {apt.status === 'pending' ? (
                        <div className="flex gap-3 border-t border-gray-100 pt-3 mt-2">
                          <button 
                            onClick={() => handleStatusChange(apt.id, 'confirmed')}
                            className="flex-1 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <Check size={14} />
                            Aceptar
                          </button>
                          <button 
                            onClick={() => handleStatusChange(apt.id, 'rejected')}
                            className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200/30 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                          >
                            <X size={14} />
                            Rechazar
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-3 border-t border-gray-100 pt-3 mt-2">
                          <button 
                            onClick={() => {
                              const patientDetail = mockPatients.find(p => p.name === apt.patient);
                              if (patientDetail) setSelectedPatient(patientDetail);
                              else alert(`Simulación: Historial Clínico de ${apt.patient}`);
                            }}
                            className="w-full py-2 bg-slate-50 hover:bg-teal-50 text-[#0D9488] border border-[#0D9488]/10 rounded-xl text-xs font-bold transition-colors"
                          >
                            Ver Historia Médica
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* VIEW: PATIENTS DIRECTORY */}
          {currentView === 'patients' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Mis Pacientes</h2>
                  <p className="text-sm text-gray-500">Directorio y registros clínicos de tus pacientes</p>
                </div>
                <div className="relative w-full md:w-72">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Buscar paciente por nombre..." 
                    className="pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0D9488]/20 w-full"
                  />
                </div>
              </div>

              {/* Grid of Patients */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockPatients.map((pat) => (
                  <div key={pat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft hover:shadow-md transition-shadow flex flex-col items-center text-center">
                    <Avatar src={pat.image} alt={pat.name} size="lg" className="mb-3 border-2 border-gray-100" />
                    
                    <h4 className="font-bold text-gray-900 text-base leading-tight">{pat.name}</h4>
                    <p className="text-xs text-gray-400 mt-1">{pat.age} años</p>
                    
                    <div className="w-full bg-slate-50 py-2.5 px-4 rounded-xl text-xs text-gray-600 flex justify-between my-4 border border-gray-100">
                      <span className="font-medium text-gray-400">Última Visita:</span>
                      <span className="font-bold text-gray-800">{pat.lastVisit}</span>
                    </div>

                    <button 
                      onClick={() => setSelectedPatient(pat)}
                      className="w-full py-2.5 bg-slate-50 hover:bg-teal-50 text-[#0D9488] border border-[#0D9488]/20 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <FileText size={14} />
                      Ver Perfil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {currentView === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
                <p className="text-sm text-gray-500">Actualiza tus datos profesionales y credenciales</p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 border-b border-gray-50 pb-2">Datos Profesionales</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] transition-all text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Especialidad</label>
                      <input 
                        type="text" 
                        value={formData.specialty}
                        onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] transition-all text-gray-800"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Corporativo</label>
                      <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] transition-all text-gray-800"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Teléfono</label>
                      <input 
                        type="tel" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] transition-all text-gray-800"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Availability State */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 border-b border-gray-50 pb-2">Estado y Disponibilidad</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Disponibilidad en Consultorio</p>
                      <p className="text-xs text-gray-500">Muestra tu perfil activo para recibir pacientes</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAvailable(!isAvailable)}
                      className={`w-12 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${isAvailable ? 'bg-[#0D9488]' : 'bg-gray-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-all ${isAvailable ? 'ml-7' : 'ml-1'}`} />
                    </button>
                  </div>
                </div>

                {/* Security Passwords */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-soft space-y-4">
                  <h3 className="font-bold text-lg text-gray-900 border-b border-gray-50 pb-2">Seguridad</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contraseña Actual</label>
                      <div className="relative">
                        <input 
                          type={showCurrentPassword ? 'text' : 'password'} 
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          placeholder="••••••••"
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] transition-all text-gray-800"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nueva Contraseña</label>
                      <div className="relative">
                        <input 
                          type={showNewPassword ? 'text' : 'password'} 
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          placeholder="••••••••"
                          className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488] transition-all text-gray-800"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="flex justify-end pt-2">
                  <button 
                    type="submit"
                    className="px-6 py-3 bg-[#0D9488] hover:bg-[#0d9488]/90 text-white font-bold rounded-xl text-sm shadow-lg shadow-[#0D9488]/20 flex items-center gap-2 transition-colors"
                  >
                    <Save size={18} />
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </main>

      {/* MODAL: MEDICAL HISTORY */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Modal Header */}
            <div className="bg-slate-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div className="flex items-center gap-2 text-[#0D9488]">
                <FileText size={20} />
                <h3 className="font-heading font-bold text-lg text-gray-900">Historia Médica</h3>
              </div>
              <button 
                onClick={() => setSelectedPatient(null)} 
                className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Profile Card */}
              <div className="flex items-center gap-4 bg-teal-50/30 p-4 rounded-2xl border border-[#0D9488]/10">
                <Avatar src={selectedPatient.image} alt={selectedPatient.name} size="lg" />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg leading-tight">{selectedPatient.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{selectedPatient.age} años • Última visita: {selectedPatient.lastVisit}</p>
                </div>
              </div>

              {/* History Info */}
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Diagnóstico / Historial</span>
                  <p className="text-sm text-gray-700 bg-slate-50 p-3 rounded-xl border border-gray-100 leading-relaxed font-medium">
                    {selectedPatient.history}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Alergias</span>
                    <div className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 font-bold">
                      <ShieldAlert size={16} className="shrink-0" />
                      <span>{selectedPatient.allergies}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Últimas Recetas</span>
                    <div className="space-y-1 bg-blue-50/50 p-3 rounded-xl border border-blue-100/50 text-xs font-semibold text-blue-900">
                      {selectedPatient.prescriptions.map((pres, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span>{pres}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Notas Médicas del Doctor</span>
                  <div className="text-sm text-gray-700 bg-slate-50 p-3 rounded-xl border border-gray-100 leading-relaxed italic">
                    "{selectedPatient.notes}"
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-gray-800 rounded-xl text-xs font-bold transition-colors"
              >
                Cerrar Historia
              </button>
              <button
                onClick={() => {
                  alert(`Simulación: Imprimiendo reporte de ${selectedPatient.name}`);
                }}
                className="px-5 py-2.5 bg-[#0D9488] hover:bg-[#0d9488]/90 text-white rounded-xl text-xs font-bold shadow-md shadow-[#0D9488]/10 transition-colors"
              >
                Imprimir Historial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
