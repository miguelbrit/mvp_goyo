import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { AuthLayout } from '../components/AuthLayout';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { SocialAuthButtons } from '../components/SocialAuthButtons';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack }) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        let errorMessage = error.message || 'Error al iniciar sesión';
        if (error.message === 'Invalid login credentials') {
          errorMessage = 'Credenciales incorrectas. Por favor, verifica tu correo y contraseña.';
        } else if (error.message === 'Email not confirmed') {
          errorMessage = 'Tu correo electrónico no ha sido verificado aún. Revisa tu bandeja de entrada.';
        }
        setError(errorMessage);
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error inesperado al intentar ingresar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout 
      title="¡Hola de nuevo!" 
      subtitle="Ingresa tus credenciales para acceder a tu cuenta."
      onBack={onBack}
    >
      <div className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl text-center animate-in fade-in">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6">
          <Input 
            label="Correo Electrónico" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com" 
            icon={<Mail size={18} />}
            required
            disabled={isSubmitting}
          />
          
          <Input 
            label="Contraseña" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" 
            icon={<Lock size={18} />}
            required
            disabled={isSubmitting}
          />

          <Button 
            label={isSubmitting ? "Iniciando..." : "Ingresar"} 
            variant="primary" 
            fullWidth 
            type="submit"
            disabled={isSubmitting || !email || !password}
            icon={isSubmitting ? Loader2 : undefined}
          />
        </form>

        <div className="relative my-8">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
           <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400">O ingresa con</span></div>
        </div>

        <SocialAuthButtons />
      </div>
    </AuthLayout>
  );
};

