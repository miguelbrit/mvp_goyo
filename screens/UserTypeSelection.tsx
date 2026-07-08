import React, { useState } from 'react';
import { User, Activity, Package, FlaskConical, Loader2 } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelectRole: (role: 'patient' | 'doctor' | 'pharmacy' | 'lab') => void;
}

export const UserTypeSelection: React.FC<UserTypeSelectionProps> = ({ onSelectRole }) => {
  const [loadingRole, setLoadingRole] = useState<'patient' | 'doctor' | 'pharmacy' | 'lab' | null>(null);

  const roles = [
    {
      id: 'patient' as const,
      title: 'Paciente',
      description: 'Accede a tus recetas, historial médico y chatea con especialistas.',
      icon: User,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      id: 'doctor' as const,
      title: 'Médico',
      description: 'Gestiona tus citas, pacientes e historial clínico digital.',
      icon: Activity,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      id: 'pharmacy' as const,
      title: 'Farmacia',
      description: 'Controla el inventario de medicamentos y gestiona pedidos a domicilio.',
      icon: Package,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
    {
      id: 'lab' as const,
      title: 'Laboratorio',
      description: 'Publica resultados de análisis clínicos y agenda citas de laboratorio.',
      icon: FlaskConical,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
    },
  ];

  const handleRoleClick = (roleId: 'patient' | 'doctor' | 'pharmacy' | 'lab') => {
    setLoadingRole(roleId);
    
    // Simulate authentication delay of 900ms
    setTimeout(() => {
      localStorage.setItem('drgoyo_user_role', roleId);
      // Also store user_role and user_name for backward compatibility with existing views if needed
      localStorage.setItem('user_role', roleId);
      const names = {
        patient: 'Paciente Demo',
        doctor: 'Dr. Alejandro G.',
        pharmacy: 'Farmacia El Sol',
        lab: 'Lab Central'
      };
      localStorage.setItem('user_name', names[roleId]);

      onSelectRole(roleId);
      setLoadingRole(null);
    }, 900);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 py-12 font-sans">
      <div className="w-full max-w-2xl text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-3 tracking-tight">
          Bienvenido a <span className="text-[#0D9488]">Dr. Goyo</span>
        </h1>
        <p className="text-slate-500 text-base md:text-lg max-w-md mx-auto">
          Selecciona tu tipo de usuario para acceder directamente a tu suite personalizada.
        </p>
      </div>

      <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => {
          const IconComponent = role.icon;
          const isSelected = loadingRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => !loadingRole && handleRoleClick(role.id)}
              disabled={loadingRole !== null}
              className={`w-full text-left bg-white p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between h-48 relative overflow-hidden group
                ${isSelected 
                  ? 'border-[#0D9488] ring-2 ring-[#0D9488]/20 shadow-md scale-[0.98]' 
                  : 'border-slate-200 hover:border-[#0D9488] hover:shadow-lg shadow-sm hover:scale-[1.01]'
                }
                ${loadingRole !== null && !isSelected ? 'opacity-50' : 'opacity-100'}
              `}
            >
              {/* Icon Container */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${role.bgColor} ${role.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                <IconComponent size={24} />
              </div>

              {/* Text Description */}
              <div className="mt-4">
                <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#0D9488] transition-colors duration-300">
                  {role.title}
                </h3>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed line-clamp-2">
                  {role.description}
                </p>
              </div>

              {/* Loader Overlay */}
              {isSelected && (
                <div className="absolute inset-0 bg-[#0D9488]/5 backdrop-blur-[1px] flex flex-col items-center justify-center gap-2 animate-in fade-in duration-200">
                  <Loader2 className="animate-spin text-[#0D9488] w-8 h-8" />
                  <span className="text-[#0D9488] text-xs font-bold uppercase tracking-wider">Validando...</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <p className="text-xs text-slate-400">
          Entorno de simulación local activo. No se requieren credenciales reales de acceso.
        </p>
      </div>
    </div>
  );
};
