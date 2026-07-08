import React from 'react';
import { Stethoscope, LogOut, Calendar, Clock, Users, DollarSign } from 'lucide-react';

interface DoctorSimpleDashboardProps {
  onLogout: () => void;
  userName?: string;
}

const MOCK_APPOINTMENTS = [
  { id: 1, patient: 'María González', time: '09:00 AM', type: 'Consulta General', status: 'Confirmada' },
  { id: 2, patient: 'Carlos Pérez', time: '10:30 AM', type: 'Control Cardíaco', status: 'Confirmada' },
  { id: 3, patient: 'Ana Rodríguez', time: '2:00 PM', type: 'Electrocardiograma', status: 'Pendiente' },
];

export const DoctorSimpleDashboard: React.FC<DoctorSimpleDashboardProps> = ({ onLogout, userName }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-500/20">
              <Stethoscope size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-gray-900">Dr. Alejandro Mendoza</h1>
              <p className="text-sm text-primary font-medium">Cardiología</p>
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
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">3</p>
            <p className="text-xs text-gray-500 font-medium">Citas Hoy</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 text-center">
            <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500 font-medium">Pacientes</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 text-center">
            <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <DollarSign size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">$0</p>
            <p className="text-xs text-gray-500 font-medium">Hoy</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-heading font-bold text-lg text-gray-900">Próximas Citas</h2>
            <span className="text-xs text-gray-400 font-medium">Hoy</span>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_APPOINTMENTS.map((apt) => (
              <div key={apt.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                    {apt.patient.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{apt.patient}</p>
                    <p className="text-xs text-gray-500">{apt.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                    <Clock size={12} />
                    {apt.time}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    apt.status === 'Confirmada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-gray-300 font-medium tracking-widest uppercase">
          Dr. Goyo v1.0 — Demo Médico
        </p>
      </div>
    </div>
  );
};
