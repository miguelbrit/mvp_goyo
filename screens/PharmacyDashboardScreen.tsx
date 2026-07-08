import React, { useState } from 'react';
import {
  LayoutDashboard, Package, ShoppingCart, BarChart, MessageSquare, Settings, LogOut,
  Bell, Menu, Search, Plus, AlertTriangle, ChevronRight, Filter, DollarSign, Edit, Trash2, MapPin, Loader2,
  Phone, Mail, Clock, Truck, Save, CheckCircle
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { AvatarUploader } from '../components/AvatarUploader';
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

interface PharmacyDashboardProps {
  onLogout: () => void;
  userName?: string;
  userProfile?: any;
  onProfileUpdate?: () => void;
}

type DashboardView = 'overview' | 'inventory' | 'orders' | 'chat' | 'stats' | 'settings';

const MOCK_PHARMACY = {
  name: 'Farmacia El Sol',
  email: 'contacto@farmaciaelsol.com',
  imageUrl: '',
  pharmacy: {
    businessName: 'Farmacia El Sol',
    address: 'Av. Principal, Centro',
    city: 'Caracas',
    openingHours: '08:00',
    closingHours: '20:00',
    hasDelivery: true,
    phone: '0212-555-1234',
    description: 'Farmacia con más de 10 años de experiencia al servicio de la comunidad.',
    status: 'VERIFIED',
  },
};

export const PharmacyDashboardScreen: React.FC<PharmacyDashboardProps> = ({ onLogout, userName: initialUserName = "Farmacia El Sol", userProfile: initialUserProfile }) => {
  const [currentView, setCurrentView] = useState<DashboardView>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [profile] = useState(initialUserProfile || MOCK_PHARMACY);
  const [loading] = useState(false);
  const [userName] = useState(initialUserName || 'Farmacia El Sol');

  const [editForm, setEditForm] = useState({
    name: 'Farmacia El Sol',
    address: 'Av. Principal, Centro',
    city: 'Caracas',
    openingHours: '08:00',
    closingHours: '20:00',
    hasDelivery: true,
    imageUrl: '',
    phone: '0212-555-1234',
    description: 'Farmacia con más de 10 años de experiencia al servicio de la comunidad.',
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSaveProfile = () => {
    setSaveStatus('success');
    setSaveMessage('Cambios guardados exitosamente.');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  const pharmacyData = MOCK_PHARMACY.pharmacy;
  const city = pharmacyData.city || "Caracas";
  const address = pharmacyData.address || "Av. Principal, Centro";

  const stats = [
    { label: 'Ventas del Día', value: '$320.00', icon: DollarSign, color: 'bg-green-100 text-green-600' },
    { label: 'Cotizaciones Pendientes', value: '2', icon: ShoppingCart, color: 'bg-blue-100 text-blue-600' },
    { label: 'Stock Bajo', value: '3', icon: AlertTriangle, color: 'bg-orange-100 text-orange-600' },
    { label: 'Mensajes', value: '4', icon: MessageSquare, color: 'bg-purple-100 text-purple-600' },
  ];

  const lowStockItems = [
    { id: 1, name: 'Amoxicilina 500mg', stock: 5, min: 20 },
    { id: 2, name: 'Losartán 50mg', stock: 3, min: 15 },
    { id: 3, name: 'Metformina 850mg', stock: 8, min: 25 },
  ];

  const recentOrders = [
    { id: 1, customer: 'Juan Medina', items: 3, total: 45.50, time: 'Hace 15 min', status: 'pending' },
    { id: 2, customer: 'Laura Castillo', items: 1, total: 22.00, time: 'Hace 30 min', status: 'pending' },
    { id: 3, customer: 'Pedro Rojas', items: 2, total: 38.00, time: 'Hace 2h', status: 'completed' },
  ];

  const inventory = [
    { id: 1, name: 'Amoxicilina 500mg', category: 'Antibióticos', price: 12.50, stock: 5, status: 'low' },
    { id: 2, name: 'Losartán 50mg', category: 'Cardiovascular', price: 22.00, stock: 3, status: 'low' },
    { id: 3, name: 'Metformina 850mg', category: 'Diabetes', price: 15.00, stock: 8, status: 'low' },
    { id: 4, name: 'Ibuprofeno 600mg', category: 'Antiinflamatorio', price: 8.50, stock: 45, status: 'ok' },
    { id: 5, name: 'Omeprazol 20mg', category: 'Gastrointestinal', price: 10.00, stock: 30, status: 'ok' },
  ];

  const SidebarItem = ({ id, icon: Icon, label }: { id: DashboardView; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(id);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        currentView === id
          ? 'bg-primary text-white shadow-lg shadow-primary/30'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-bg flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-bg flex">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
              <Package size={24} />
            </div>
            <div>
               <h1 className="font-heading font-bold text-xl text-gray-900">Dr. Goyo</h1>
               <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Farmacias</span>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard" />
            <SidebarItem id="inventory" icon={Package} label="Inventario" />
            <SidebarItem id="orders" icon={ShoppingCart} label="Pedidos" />
            <SidebarItem id="chat" icon={MessageSquare} label="Chat" />
            <SidebarItem id="stats" icon={BarChart} label="Estadísticas" />
            <SidebarItem id="settings" icon={Settings} label="Configuración" />
          </nav>

          <div className="pt-6 border-t border-gray-100">
             <button
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium"
             >
               <LogOut size={20} />
               Cerrar Sesión
             </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-gray-200 h-20 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:block">
               <h2 className="text-xl font-heading font-bold text-gray-800">{userName}</h2>
               <div className="flex items-center gap-1 text-xs text-gray-500">
                  <MapPin size={12} />
                  <span>{address}, {city}</span>
               </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3 bg-gray-100 p-1 rounded-full">
               <button
                  onClick={() => setIsOpen(true)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isOpen ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500'}`}
               >
                  Abierto
               </button>
               <button
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${!isOpen ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500'}`}
               >
                  Cerrado
               </button>
            </div>
            <button className="relative p-2 hover:bg-gray-100 rounded-full text-gray-500">
              <Bell size={20} />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <Avatar src={profile?.imageUrl || ''} alt="Farmacia" size="md" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {currentView === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, idx) => <StatCard key={idx} item={stat} />)}
               </div>
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-6">
                     <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                           <h3 className="font-heading font-bold text-lg text-gray-900">Información del Negocio</h3>
                           <button onClick={() => setCurrentView('settings')} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors">
                             <Edit size={18} />
                           </button>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Phone size={14} /></div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Teléfono de Contacto</p>
                                <p className="text-sm font-bold text-gray-900">{editForm.phone || "No registrado"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Mail size={14} /></div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Correo Electrónico</p>
                                <p className="text-sm font-bold text-gray-900">{profile?.email || "No registrado"}</p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0"><Clock size={14} /></div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Horario de Atención</p>
                                <p className="text-sm font-bold text-gray-900">{pharmacyData.openingHours || "00:00"} a {pharmacyData.closingHours || "00:00"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center shrink-0"><Truck size={14} /></div>
                              <div>
                                <p className="text-xs text-gray-500 font-medium">Servicio Delivery</p>
                                <p className="text-sm font-bold text-gray-900">{pharmacyData.hasDelivery ? "Disponible" : "No disponible"}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                     </div>

                     <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                           <h3 className="font-heading font-bold text-lg text-gray-900">Pedidos Recientes</h3>
                           <button onClick={() => setCurrentView('orders')} className="text-primary text-sm font-medium hover:underline">Ver todos</button>
                        </div>
                        <div className="divide-y divide-gray-100">
                           {recentOrders.map((order) => (
                              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                       <ShoppingCart size={18} />
                                    </div>
                                    <div>
                                       <p className="font-bold text-gray-900">{order.customer}</p>
                                       <p className="text-xs text-gray-500">{order.items} artículos • {order.time}</p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-bold text-gray-900">${order.total.toFixed(2)}</p>
                                    <span className={`text-[10px] font-bold uppercase ${order.status === 'pending' ? 'text-orange-500' : 'text-green-500'}`}>
                                       {order.status === 'pending' ? 'Pendiente' : 'Completado'}
                                    </span>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <div className="bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                        <div className="flex items-center gap-2 mb-4">
                           <AlertTriangle className="text-orange-500" size={20} />
                           <h3 className="font-heading font-bold text-lg text-gray-900">Stock Bajo</h3>
                        </div>
                        <div className="space-y-3">
                           {lowStockItems.map((item) => (
                              <div key={item.id} className="flex justify-between items-center p-3 bg-orange-50 rounded-xl border border-orange-100">
                                 <div>
                                    <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                                    <p className="text-xs text-orange-700">Quedan: {item.stock} (Mín: {item.min})</p>
                                 </div>
                                 <button className="text-xs bg-white text-orange-600 font-bold px-2 py-1 rounded border border-orange-200 hover:bg-orange-100">Reponer</button>
                              </div>
                           ))}
                        </div>
                         <button onClick={() => setCurrentView('inventory')} className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 font-medium">Ver inventario completo</button>
                      </div>

                      {/* Article Carousel */}
                      <ArticleCarousel title="Artículos de Opinión" autoSlide={true} />
                   </div>
                </div>
             </div>
           )}

          {currentView === 'inventory' && (
            <div className="animate-in fade-in slide-in-from-bottom-4">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
                  <div className="flex gap-2 w-full md:w-auto">
                     <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="Buscar medicamento..." className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                     </div>
                     <button className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"><Filter size={20} /></button>
                     <Button label="Agregar" icon={Plus} />
                  </div>
               </div>
               <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                     <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold border-b border-gray-200">
                        <tr>
                           <th className="p-4">Producto</th>
                           <th className="p-4">Categoría</th>
                           <th className="p-4">Precio</th>
                           <th className="p-4">Stock</th>
                           <th className="p-4">Estado</th>
                           <th className="p-4 text-right">Acciones</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {inventory.map((item) => (
                           <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="p-4">
                                 <div className="font-bold text-gray-900">{item.name}</div>
                                 <div className="text-xs text-gray-400">ID: #{item.id}</div>
                              </td>
                              <td className="p-4 text-sm text-gray-600">{item.category}</td>
                              <td className="p-4 font-medium text-gray-900">${item.price.toFixed(2)}</td>
                              <td className="p-4 text-sm text-gray-600">{item.stock} un.</td>
                              <td className="p-4">
                                 <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                                    item.status === 'ok' ? 'bg-green-100 text-green-700' :
                                    item.status === 'low' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                 }`}>
                                    {item.status === 'ok' ? 'Disponible' : item.status === 'low' ? 'Bajo' : 'Crítico'}
                                 </span>
                              </td>
                              <td className="p-4 text-right">
                                 <div className="flex justify-end gap-2">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit size={16} /></button>
                                    <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {currentView === 'settings' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 max-w-4xl mx-auto">
               <div className="flex justify-between items-center mb-6">
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">Configuración del Perfil</h2>
                   <p className="text-sm text-gray-500">Actualiza la información visible para tus clientes</p>
                 </div>
                 <Button
                   label={saveStatus === 'saving' ? 'Guardando...' : saveStatus === 'success' ? '¡Guardado!' : 'Guardar Cambios'}
                   icon={saveStatus === 'success' ? CheckCircle : Save}
                   onClick={handleSaveProfile}
                   disabled={saveStatus === 'saving'}
                   className={saveStatus === 'success' ? '!bg-green-600 !hover:bg-green-700 !border-green-600' : ''}
                 />
               </div>

               {saveMessage && (
                 <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${saveStatus === 'error' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                   {saveStatus === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />}
                   <p className="font-medium text-sm">{saveMessage}</p>
                 </div>
               )}

               <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden mb-8">
                 <div className="p-6 border-b border-gray-100">
                   <h3 className="font-bold text-lg text-gray-900 mb-4">Datos Generales</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Input
                       label="Nombre del Negocio"
                       value={editForm.name}
                       onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                       icon={<LayoutDashboard size={18} />}
                     />
                     <Input
                       label="Teléfono de Contacto"
                       type="tel"
                       value={editForm.phone}
                       onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                       icon={<Phone size={18} />}
                     />
                   </div>
                 </div>

                 <div className="p-6 border-b border-gray-100">
                   <h3 className="font-bold text-lg text-gray-900 mb-4">Ubicación y Horarios</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                     <Input
                       label="Ciudad / Zona"
                       value={editForm.city}
                       onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                       icon={<MapPin size={18} />}
                     />
                     <Input
                       label="Dirección Física"
                       value={editForm.address}
                       onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                       icon={<MapPin size={18} />}
                     />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Input
                       label="Hora de Apertura"
                       type="time"
                       value={editForm.openingHours}
                       onChange={(e) => setEditForm({...editForm, openingHours: e.target.value})}
                       icon={<Clock size={18} />}
                     />
                     <Input
                       label="Hora de Cierre"
                       type="time"
                       value={editForm.closingHours}
                       onChange={(e) => setEditForm({...editForm, closingHours: e.target.value})}
                       icon={<Clock size={18} />}
                     />
                   </div>
                 </div>

                 <div className="p-6">
                   <h3 className="font-bold text-lg text-gray-900 mb-4">Opciones Adicionales</h3>
                   <div className="space-y-6">
                     <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <button
                        onClick={() => setEditForm({...editForm, hasDelivery: !editForm.hasDelivery})}
                        className={`w-12 h-6 rounded-full transition-colors relative flex items-center ${editForm.hasDelivery ? 'bg-primary' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full transition-all ${editForm.hasDelivery ? 'ml-7' : 'ml-1'}`} />
                      </button>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">Ofrece Servicio de Delivery</p>
                        <p className="text-xs text-gray-500">Activa si realizas envíos a domicilio de medicamentos</p>
                      </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="md:col-span-2">
                         <label className="block text-sm font-bold text-gray-500 mb-2">Fotografía o Logo de la Farmacia</label>
                         <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 flex justify-center">
                           <AvatarUploader
                             currentImageUrl={editForm.imageUrl}
                             onUploadSuccess={(url) => {
                               setEditForm({...editForm, imageUrl: url});
                             }}
                             userId={profile?.id}
                             userName={profile?.name}
                           />
                         </div>
                       </div>
                     </div>

                     <div>
                       <label className="block text-sm font-bold text-gray-500 mb-2">Descripción Corta</label>
                       <textarea
                         className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white min-h-[100px] outline-none focus:ring-2 focus:ring-primary/20 text-gray-900"
                         placeholder="Describe brevemente tu farmacia..."
                         value={editForm.description}
                         onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                       />
                     </div>
                   </div>
                 </div>
               </div>
            </div>
          )}

          {currentView !== 'overview' && currentView !== 'inventory' && currentView !== 'settings' && (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
               <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4"><Settings size={48} /></div>
               <h3 className="text-xl font-bold text-gray-900">Sección en Construcción</h3>
               <p className="text-gray-500 max-w-md mt-2">Estamos trabajando para habilitar el módulo de {currentView} lo antes posible.</p>
               <Button label="Volver al Dashboard" variant="outline" className="mt-6" onClick={() => setCurrentView('overview')} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
