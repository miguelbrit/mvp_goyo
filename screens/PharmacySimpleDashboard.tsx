import React from 'react';
import { Pill, LogOut, ShoppingCart, DollarSign, Package, Clock } from 'lucide-react';

interface PharmacySimpleDashboardProps {
  onLogout: () => void;
  userName?: string;
}

const MOCK_QUOTES = [
  { id: 1, client: 'Juan Medina', product: 'Amoxicilina 500mg', quantity: '2 cajas', time: 'Hace 15 min' },
  { id: 2, client: 'Laura Castillo', product: 'Losartán 50mg', quantity: '1 caja', time: 'Hace 30 min' },
];

export const PharmacySimpleDashboard: React.FC<PharmacySimpleDashboardProps> = ({ onLogout, userName }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Pill size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-gray-900">Farmacia El Sol</h1>
              <p className="text-sm text-purple-600 font-medium">Centro, Caracas</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 hover:border-red-200 hover:text-red-500 transition-all shadow-soft text-sm"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 text-center">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <ShoppingCart size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">2</p>
            <p className="text-xs text-gray-500 font-medium">Cotizaciones</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 text-center">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <DollarSign size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">$0</p>
            <p className="text-xs text-gray-500 font-medium">Ventas Hoy</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 text-center">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Package size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">156</p>
            <p className="text-xs text-gray-500 font-medium">Productos</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-heading font-bold text-lg text-gray-900">Solicitudes de Cotización</h2>
            <span className="text-xs text-gray-400 font-medium">Pendientes</span>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_QUOTES.map((q) => (
              <div key={q.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
                    {q.client.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{q.client}</p>
                    <p className="text-xs text-gray-500">{q.product} · {q.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock size={12} />
                  {q.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-gray-300 font-medium tracking-widest uppercase">
          Dr. Goyo v1.0 — Demo Farmacia
        </p>
      </div>
    </div>
  );
};
