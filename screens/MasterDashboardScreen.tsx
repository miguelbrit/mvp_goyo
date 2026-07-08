import React, { useState } from 'react';
import {
  LayoutDashboard, Users, Stethoscope, Pill, FlaskConical,
  Settings, LogOut, Bell, Menu, ShieldAlert, CheckCircle, XCircle,
  Activity, ChevronRight
} from 'lucide-react';
import { Avatar } from '../components/Avatar';

interface StatItem {
  label: string;
  value: string;
  icon: any;
  color: string;
}

interface PendingApproval {
  id: number;
  name: string;
  type: string;
  city: string;
  status: string;
}

interface ActivityItem {
  id: number;
  text: string;
  time: string;
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

interface MasterDashboardScreenProps {
  onNavigateToHome?: () => void;
}

const MasterDashboardScreen: React.FC<MasterDashboardScreenProps> = ({
  onNavigateToHome
}) => {
  const [currentView, setCurrentView] = useState<'overview' | 'users' | 'approvals' | 'settings'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const masterStats = {
    patients: 1240,
    doctors: 85,
    pharmacies: 42,
    labs: 18,
    total: 1385
  };

  const pendingApprovals: PendingApproval[] = [
    { id: 1, name: "Dr. Javier Ríos", type: "Médico", city: "Maracaibo", status: "pending" },
    { id: 2, name: "Farmacia El Sol", type: "Farmacia", city: "Caracas", status: "pending" },
    { id: 3, name: "Lab Central", type: "Laboratorio", city: "Valencia", status: "pending" }
  ];

  const recentActivity: ActivityItem[] = [
    { id: 1, text: "Nuevo paciente registrado: Carlos Pérez", time: "Hace 5 min" },
    { id: 2, text: "Laboratorio Central subió 50 resultados", time: "Hace 1 hora" },
    { id: 3, text: "Farmacia Los Andes actualizó su inventario", time: "Hace 2 horas" },
    { id: 4, text: "Nueva solicitud de registro: Dra. Valentina Soto", time: "Hace 3 horas" },
    { id: 5, text: "Sistema: Backup automático completado", time: "Hace 6 horas" }
  ];

  const stats: StatItem[] = [
    { label: 'Total Pacientes', value: masterStats.patients.toLocaleString(), icon: Users, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Médicos', value: masterStats.doctors.toLocaleString(), icon: Stethoscope, color: 'bg-teal-50 text-[#0D9488]' },
    { label: 'Total Farmacias', value: masterStats.pharmacies.toLocaleString(), icon: Pill, color: 'bg-green-50 text-green-600' },
    { label: 'Total Laboratorios', value: masterStats.labs.toLocaleString(), icon: FlaskConical, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Usuarios', value: masterStats.total.toLocaleString(), icon: ShieldAlert, color: 'bg-orange-50 text-orange-600' }
  ];

  const SidebarItem = ({ id, icon: Icon, label }: { id: typeof currentView; icon: any; label: string }) => (
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

  const handleApprove = (id: number) => {
    alert(`Usuario ${id} aprobado exitosamente`);
  };

  const handleReject = (id: number) => {
    alert(`Usuario ${id} rechazado`);
  };

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
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-3 mb-10 px-2 w-full text-left hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-[#0D9488]">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-gray-900">Dr. Goyo</h1>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Master</span>
            </div>
          </button>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem id="users" icon={Users} label="Usuarios" />
            <SidebarItem id="approvals" icon={ShieldAlert} label="Aprobaciones" />
            <SidebarItem id="settings" icon={Settings} label="Configuración" />
          </nav>

          {/* Logout Button */}
          <div className="pt-6 border-t border-gray-100">
            <button
              onClick={() => alert('Cerrando sesión...')}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </div>
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
            <div>
              <h2 className="text-xl font-heading font-bold text-gray-800">Panel Maestro</h2>
              <p className="text-xs text-gray-500">Visión global de la plataforma</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <Avatar src="https://ui-avatars.com/api/?name=Master+Admin&background=0D9488&color=fff" alt="Master" size="md" />
              <div className="hidden md:block">
                <p className="text-sm font-bold text-gray-900">Admin Master</p>
                <p className="text-xs text-gray-500">Superadmin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {/* VIEW: OVERVIEW */}
          {currentView === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
              {/* Summary Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {stats.map((stat, idx) => (
                  <StatCard key={idx} item={stat} />
                ))}
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Approvals */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-heading font-bold text-lg text-gray-900">Solicitudes Pendientes</h3>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                      {pendingApprovals.length} pendientes
                    </span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {pendingApprovals.map((approval) => (
                      <div key={approval.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                            <ShieldAlert size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{approval.name}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span className="bg-gray-100 px-2 py-0.5 rounded-full font-medium">{approval.type}</span>
                              <span>•</span>
                              <span>{approval.city}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(approval.id)}
                            className="p-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-colors"
                            title="Aprobar"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => handleReject(approval.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                            title="Rechazar"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {pendingApprovals.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No hay solicitudes pendientes por ahora.
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
                  <h3 className="font-heading font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                    <Activity size={20} className="text-[#0D9488]" />
                    Actividad Reciente del Sistema
                  </h3>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex gap-3 items-start text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#0D9488] mt-2 shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-gray-700 font-medium leading-snug">{activity.text}</p>
                          <span className="text-[10px] text-gray-400 mt-1 block">{activity.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: USERS */}
          {currentView === 'users' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestión de Usuarios</h2>
                <p className="text-sm text-gray-500">Administra pacientes, médicos, farmacias y laboratorios</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Módulo en Construcción</h3>
                <p className="text-gray-500 max-w-md mx-auto">La gestión avanzada de usuarios estará disponible próximamente.</p>
              </div>
            </div>
          )}

          {/* VIEW: APPROVALS */}
          {currentView === 'approvals' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Aprobaciones</h2>
                <p className="text-sm text-gray-500">Revisa y aprueba nuevas solicitudes de registro</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-bold text-lg text-gray-900">Solicitudes Pendientes</h3>
                    <span className="text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
                      {pendingApprovals.length} pendientes
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                          <ShieldAlert size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{approval.name}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                            <span className="bg-gray-100 px-2 py-0.5 rounded-full text-xs font-medium">{approval.type}</span>
                            <span>•</span>
                            <span>{approval.city}</span>
                            <span>•</span>
                            <span className="text-orange-500 font-medium">Pendiente</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(approval.id)}
                          className="px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                        >
                          <CheckCircle size={16} />
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleReject(approval.id)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-bold transition-colors flex items-center gap-2"
                        >
                          <XCircle size={16} />
                          Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {pendingApprovals.length === 0 && (
                  <div className="p-12 text-center text-gray-400">
                    <CheckCircle size={48} className="mx-auto mb-3 text-green-300" />
                    <p className="font-medium">No hay solicitudes pendientes</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {currentView === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
                <p className="text-sm text-gray-500">Ajustes generales de la plataforma</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-soft p-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                  <Settings size={32} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Configuración General</h3>
                <p className="text-gray-500 max-w-md mx-auto">Los ajustes de configuración global estarán disponibles próximamente.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export { MasterDashboardScreen };
