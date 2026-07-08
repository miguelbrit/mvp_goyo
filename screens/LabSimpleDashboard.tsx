import React from 'react';
import { FlaskConical, LogOut, Calendar, FileText, Users, Clock } from 'lucide-react';

interface LabSimpleDashboardProps {
  onLogout: () => void;
  userName?: string;
}

const MOCK_RESULTS = [
  { id: 1, patient: 'Pedro García', test: 'Hematología Completa', status: 'Listo', time: 'Hoy 9:00 AM' },
  { id: 2, patient: 'Sofía Martínez', test: 'Perfil Lipídico', status: 'Listo', time: 'Hoy 10:15 AM' },
  { id: 3, patient: 'Diego Ramírez', test: 'Glucosa en Ayunas', status: 'Listo', time: 'Ayer 4:30 PM' },
  { id: 4, patient: 'Valeria Torres', test: 'TSH Ultrasensible', status: 'Listo', time: 'Ayer 2:00 PM' },
  { id: 5, patient: 'Andrés López', test: 'Creatinina Sérica', status: 'Listo', time: 'Ayer 11:45 AM' },
];

export const LabSimpleDashboard: React.FC<LabSimpleDashboardProps> = ({ onLogout, userName }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <FlaskConical size={24} className="text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-gray-900">Lab Central</h1>
              <p className="text-sm text-orange-600 font-medium">Análisis Clínicos</p>
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
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Calendar size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">5</p>
            <p className="text-xs text-gray-500 font-medium">Resultados Listos</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 text-center">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <Users size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-xs text-gray-500 font-medium">Pacientes Hoy</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-soft border border-gray-100 text-center">
            <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mx-auto mb-2">
              <FileText size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">12</p>
            <p className="text-xs text-gray-500 font-medium">Exámenes Hoy</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-heading font-bold text-lg text-gray-900">Resultados Listos para Entrega</h2>
            <span className="text-xs text-gray-400 font-medium">5 pendientes</span>
          </div>
          <div className="divide-y divide-gray-100">
            {MOCK_RESULTS.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                    {r.patient.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{r.patient}</p>
                    <p className="text-xs text-gray-500">{r.test}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    {r.time}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-green-100 text-green-700">
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-gray-300 font-medium tracking-widest uppercase">
          Dr. Goyo v1.0 — Demo Laboratorio
        </p>
      </div>
    </div>
  );
};
