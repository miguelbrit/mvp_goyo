import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  session: any;
  userRole: string | null;
  userProfile: any;
  profile: any;
  loading: boolean;
  isHydrated: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  const initAuthMock = () => {
    const role = localStorage.getItem('drgoyo_user_role');
    if (role) {
      const mockUser = {
        id: `mock-${role}-id`,
        email: `${role}@drgoyo.com`,
        user_metadata: { name: role === 'doctor' ? 'Dr. Alejandro G.' : role === 'pharmacy' ? 'Farmacia El Sol' : role === 'lab' ? 'Lab Central' : 'Paciente Demo' },
      };

      const roleMapping: Record<string, string> = {
        'patient': 'Paciente',
        'doctor': 'Medico',
        'pharmacy': 'Farmacia',
        'lab': 'Laboratorio',
        'admin': 'Admin'
      };

      const mockProfile = {
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.user_metadata.name,
        type: roleMapping[role] || 'Paciente',
        role: role,
        is_verified: true,
        imageUrl: role === 'doctor' ? 'https://randomuser.me/api/portraits/men/32.jpg' : '',
        patient: role === 'patient' ? { city: 'Caracas', birthDate: '1995-05-15' } : null,
        doctor: role === 'doctor' ? { specialty: 'Cardiología', city: 'Caracas', imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg' } : null,
        pharmacy: role === 'pharmacy' ? { businessName: 'Farmacia El Sol', city: 'Caracas', address: 'Av. Principal, Centro' } : null,
        laboratory: role === 'lab' ? { businessName: 'Lab Central', city: 'Caracas', address: 'Av. San Martín, Centro' } : null,
      };

      setUser(mockUser);
      setSession({ user: mockUser });
      setUserRole(role);
      setProfile(mockProfile);
    } else {
      setUser(null);
      setSession(null);
      setUserRole(null);
      setProfile(null);
    }
    setLoading(false);
    setIsHydrated(true);
  };

  useEffect(() => {
    initAuthMock();
  }, []);

  const signIn = async (email: string, password: string): Promise<{ error: any }> => {
    const MOCK_USERS: Record<string, { password: string, role: string }> = {
      'admin@drgoyo.com': { password: 'admin', role: 'admin' },
      'doctor@drgoyo.com': { password: 'doctor', role: 'doctor' },
      'patient@drgoyo.com': { password: 'patient', role: 'patient' },
      'pharmacy@drgoyo.com': { password: 'pharmacy', role: 'pharmacy' },
      'lab@drgoyo.com': { password: 'lab', role: 'lab' },
    };

    const userCredentials = MOCK_USERS[email.toLowerCase()];

    if (userCredentials && userCredentials.password === password) {
      localStorage.setItem('drgoyo_user_role', userCredentials.role);
      initAuthMock(); // This will re-initialize the auth state with the new role
      return { error: null };
    }

    return { 
      error: { 
        message: 'Credenciales inválidas. Por favor, intente de nuevo.' 
      } 
    };
  };

  const signOut = async () => {
    localStorage.removeItem('drgoyo_user_role');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    setUser(null);
    setSession(null);
    setUserRole(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    initAuthMock();
  };

  const refreshSession = async () => {
    initAuthMock();
  };

  return (
    <AuthContext.Provider value={{
      user, 
      session, 
      userRole, 
      userProfile: profile, 
      profile, 
      loading, 
      isHydrated, 
      signIn, 
      signOut, 
      refreshProfile, 
      refreshSession
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
