import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SplashScreen } from './screens/SplashScreen';
import { UserTypeSelection } from './screens/UserTypeSelection';
import { PatientHomeScreen } from './screens/PatientHomeScreen';
import { DoctorDashboardScreen } from './screens/DoctorDashboardScreen';
import { PharmacyDashboardScreen } from './screens/PharmacyDashboardScreen';
import { LabDashboardScreen } from './screens/LabDashboardScreen';
import { ChatScreen } from './screens/ChatScreen';
import { DoctorListScreen } from './screens/DoctorListScreen';
import { DoctorProfileScreen } from './screens/DoctorProfileScreen';
import { PharmacyListScreen } from './screens/PharmacyListScreen';
import { PharmacyProfileScreen } from './screens/PharmacyProfileScreen';
import { LabListScreen } from './screens/LabListScreen';
import { LabProfileScreen } from './screens/LabProfileScreen';
import { MasterDashboardScreen } from './screens/MasterDashboardScreen';
import { MedicineLibraryScreen } from './screens/MedicineLibraryScreen';
import { MedicineDetailScreen } from './screens/MedicineDetailScreen';
import { LibraryHubScreen } from './screens/LibraryHubScreen';
import { PathologyLibraryScreen } from './screens/PathologyLibraryScreen';
import { PathologyDetailScreen } from './screens/PathologyDetailScreen';
import { ArticleDetailScreen } from './screens/ArticleDetailScreen';
import { PreOpListScreen } from './screens/PreOpListScreen';
import { Toast } from './components/Toast';
import { Loader2, ChevronLeft } from 'lucide-react';
import { SearchBar } from './components/SearchBar';
import { Avatar } from './components/Avatar';
import { Banner } from './components/Banner';
import { Button } from './components/Button';
import { Doctor, Pharmacy, Laboratory, MedicineProfile, PathologyProfile, Article } from './types';

type ScreenState = 
  | 'splash' 
  | 'select-user-type' 
  | 'dashboard-paciente' 
  | 'dashboard-medico' 
  | 'dashboard-farmacia' 
  | 'dashboard-laboratorio' 
  | 'chat' 
  | 'doctors' 
  | 'doctor_profile' 
  | 'pharmacies' 
  | 'pharmacy_profile' 
  | 'labs' 
  | 'lab_profile' 
  | 'library_hub' 
  | 'medicine_library' 
  | 'medicine_detail' 
  | 'pathology_library' 
  | 'pathology_detail' 
  | 'article_detail' 
  | 'preop_list' 
  | 'uikit';

const UIKitShowcase = ({ onBack }: { onBack: () => void }) => (
    <div className="min-h-screen bg-gray-bg p-4 md:p-8">
       <div className="max-w-5xl mx-auto space-y-12">
         <div className="flex justify-between items-center">
           <div className="flex items-center gap-4">
             <button onClick={onBack} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50"><ChevronLeft/></button>
             <div>
               <h1 className="font-heading text-3xl font-bold text-secondary">Dr. Goyo</h1>
               <p className="text-gray-500 mt-1">Design System & Dashboard (Demo)</p>
             </div>
           </div>
           <Avatar src="https://picsum.photos/200/200" alt="User" status="online" size="md" />
         </div>
         <div className="grid md:grid-cols-2 gap-8">
            <Banner title="Bienvenido Paciente" subtitle="Tienes una cita próxima mañana a las 9:00 AM" type="premium" />
            <div className="bg-white p-6 rounded-2xl shadow-soft">
               <h3 className="font-heading font-semibold mb-4 ">Buscar Especialista</h3>
               <SearchBar />
            </div>
         </div>
       </div>
    </div>
);

const AppContent: React.FC = () => {
  const { profile, loading: authLoading, signOut, refreshProfile } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<ScreenState>('splash');
  const [userName, setUserName] = useState<string>('Usuario');
  
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineProfile | null>(null);
  const [selectedPathology, setSelectedPathology] = useState<PathologyProfile | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  const [openFiltersOnList, setOpenFiltersOnList] = useState(false);
  const [pharmacySearchQuery, setPharmacySearchQuery] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState('');
  const [chatInitialMessage, setChatInitialMessage] = useState<string | undefined>(undefined);
  
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Sync state with profile name
  useEffect(() => {
    if (profile?.name) {
      setUserName(profile.name);
    }
  }, [profile]);

  // Initial Router Check
  const handleSplashFinish = () => {
    const savedRole = localStorage.getItem('drgoyo_user_role');
    if (savedRole) {
      if (savedRole === 'patient') setCurrentScreen('dashboard-paciente');
      else if (savedRole === 'doctor') setCurrentScreen('dashboard-medico');
      else if (savedRole === 'pharmacy') setCurrentScreen('dashboard-farmacia');
      else if (savedRole === 'lab') setCurrentScreen('dashboard-laboratorio');
      else setCurrentScreen('select-user-type');
    } else {
      setCurrentScreen('select-user-type');
    }
  };

  const handleSelectRole = async (role: 'patient' | 'doctor' | 'pharmacy' | 'lab') => {
    await refreshProfile(); // Re-read mock profile data into AuthContext
    if (role === 'patient') setCurrentScreen('dashboard-paciente');
    else if (role === 'doctor') setCurrentScreen('dashboard-medico');
    else if (role === 'pharmacy') setCurrentScreen('dashboard-farmacia');
    else if (role === 'lab') setCurrentScreen('dashboard-laboratorio');
    
    setToastMessage(`Sesión iniciada como ${role === 'doctor' ? 'Médico' : role.charAt(0).toUpperCase() + role.slice(1)}`);
    setShowToast(true);
  };

  const handleLogout = async () => {
    await signOut(); // Clear drgoyo_user_role and reset auth context state
    setCurrentScreen('select-user-type');
    setToastMessage("Sesión cerrada");
    setShowToast(true);
  };

  const handleBottomNav = (tab: string) => {
    if (tab === 'home') setCurrentScreen('dashboard-paciente');
    else if (tab === 'doctors') {
        setOpenFiltersOnList(false);
        setDoctorSearchQuery('');
        setDoctorSpecialtyFilter('');
        setCurrentScreen('doctors');
    }
    else if (tab === 'chat') setCurrentScreen('chat');
    else if (tab === 'pharmacy') setCurrentScreen('pharmacies');
    else if (tab === 'labs') setCurrentScreen('labs');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-bg flex flex-col justify-center items-center">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
        <p className="mt-4 text-gray-500 font-medium text-sm">Cargando tu cuenta...</p>
      </div>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      
      case 'select-user-type':
        return <UserTypeSelection onSelectRole={handleSelectRole} />;
      
      case 'dashboard-medico':
        return <DoctorDashboardScreen onLogout={handleLogout} userName={profile?.name} userProfile={profile} />;
      
      case 'dashboard-farmacia':
        return <PharmacyDashboardScreen onLogout={handleLogout} userName={profile?.name} userProfile={profile} />;
      
      case 'dashboard-laboratorio':
        return <LabDashboardScreen onLogout={handleLogout} userName={profile?.name} userProfile={profile} />;
      
      case 'uikit':
        return <UIKitShowcase onBack={() => setCurrentScreen('dashboard-paciente')} />;
      
      // Patient dashboard & nested pages
      case 'dashboard-paciente':
        return (
          <PatientHomeScreen 
            userName={profile?.name || userName} 
            userProfile={profile}
            onLogout={handleLogout} 
            onProfileUpdate={refreshProfile}
            onNavigateToChat={(msg) => { setChatInitialMessage(msg); setCurrentScreen('chat'); }}
            onNavigateToMedicines={() => setCurrentScreen('medicine_library')}
            onNavigateToPathologies={() => setCurrentScreen('pathology_library')}
            onNavigateToPreOp={() => setCurrentScreen('preop_list')}
            onNavigate={handleBottomNav}
            onSelectArticle={(art) => { setSelectedArticle(art); setCurrentScreen('article_detail'); }}
            onNavigateToMasterDashboard={() => setCurrentScreen('master-dashboard')}
          />
        );
      
      case 'doctors':
        return <DoctorListScreen onBack={() => setCurrentScreen('dashboard-paciente')} onSelectDoctor={(d) => { setSelectedDoctor(d); setCurrentScreen('doctor_profile'); }} initialOpenFilters={openFiltersOnList} onNavigate={handleBottomNav} initialSearchQuery={doctorSearchQuery} initialSpecialty={doctorSpecialtyFilter} onNavigateToArticle={(art) => { setSelectedArticle(art); setCurrentScreen('article_detail'); }} />;
      
      case 'doctor_profile':
        return selectedDoctor ? <DoctorProfileScreen doctor={selectedDoctor} onBack={() => setCurrentScreen('doctors')} onChat={() => { setChatInitialMessage(`Consulta con ${selectedDoctor.name}`); setCurrentScreen('chat'); }} onNavigate={handleBottomNav} onArticleClick={(art) => { setSelectedArticle(art); setCurrentScreen('article_detail'); }} /> : null;
      
      case 'pharmacies':
        return <PharmacyListScreen onBack={() => setCurrentScreen('dashboard-paciente')} onSelectPharmacy={(p) => { setSelectedPharmacy(p); setCurrentScreen('pharmacy_profile'); }} onNavigate={handleBottomNav} initialSearchQuery={pharmacySearchQuery} onNavigateToArticle={(art) => { setSelectedArticle(art); setCurrentScreen('article_detail'); }} />;
      
      case 'pharmacy_profile':
        return selectedPharmacy ? <PharmacyProfileScreen pharmacy={selectedPharmacy} onBack={() => setCurrentScreen('pharmacies')} onChat={() => { setChatInitialMessage(`Disponibilidad en ${selectedPharmacy.name}`); setCurrentScreen('chat'); }} onNavigate={handleBottomNav} onArticleClick={(art) => { setSelectedArticle(art); setCurrentScreen('article_detail'); }} /> : null;
      
      case 'labs':
        return <LabListScreen onBack={() => setCurrentScreen('dashboard-paciente')} onSelectLab={(l) => { setSelectedLab(l); setCurrentScreen('lab_profile'); }} onNavigate={handleBottomNav} onNavigateToArticle={(art) => { setSelectedArticle(art); setCurrentScreen('article_detail'); }} />;
      
      case 'lab_profile':
        return selectedLab ? <LabProfileScreen lab={selectedLab} onBack={() => setCurrentScreen('labs')} onChat={() => { setChatInitialMessage(`Exámenes en ${selectedLab.name}`); setCurrentScreen('chat'); }} onNavigate={handleBottomNav} onArticleClick={(art) => { setSelectedArticle(art); setCurrentScreen('article_detail'); }} /> : null;
      
      case 'chat':
        return <ChatScreen initialMessage={chatInitialMessage} onBack={() => setCurrentScreen('dashboard-paciente')} onViewDoctorList={(spec) => { setDoctorSpecialtyFilter(spec); setCurrentScreen('doctors'); }} onViewPharmacyList={() => setCurrentScreen('pharmacies')} onViewLabList={() => setCurrentScreen('labs')} />;
      
      case 'library_hub':
        return <LibraryHubScreen onBack={() => setCurrentScreen('dashboard-paciente')} onNavigateToMedicines={() => setCurrentScreen('medicine_library')} onNavigateToPathologies={() => setCurrentScreen('pathology_library')} onNavigateToPreOp={() => setCurrentScreen('preop_list')} onNavigate={handleBottomNav} />;
      
      case 'medicine_library':
        return <MedicineLibraryScreen onBack={() => setCurrentScreen('library_hub')} onSelectMedicine={(m) => { setSelectedMedicine(m); setCurrentScreen('medicine_detail'); }} onNavigate={handleBottomNav} />;
      
      case 'medicine_detail':
        return selectedMedicine ? <MedicineDetailScreen medicine={selectedMedicine} onBack={() => setCurrentScreen('medicine_library')} onFindInPharmacies={(q) => { setPharmacySearchQuery(q); setCurrentScreen('pharmacies'); }} onNavigate={handleBottomNav} /> : null;
      
      case 'pathology_library':
        return <PathologyLibraryScreen onBack={() => setCurrentScreen('library_hub')} onSelectPathology={(p) => { setSelectedPathology(p); setCurrentScreen('pathology_detail'); }} onNavigate={handleBottomNav} />;
      
      case 'pathology_detail':
        return selectedPathology ? <PathologyDetailScreen pathology={selectedPathology} onBack={() => setCurrentScreen('pathology_library')} onConsultDoctors={(spec) => { setDoctorSpecialtyFilter(spec); setCurrentScreen('doctors'); }} onNavigate={handleBottomNav} /> : null;
      
      case 'article_detail':
        return selectedArticle ? <ArticleDetailScreen article={selectedArticle} onBack={() => setCurrentScreen('dashboard-paciente')} onNavigate={handleBottomNav} /> : null;
      
       case 'preop_list':
         return <PreOpListScreen onBack={() => setCurrentScreen('library_hub')} onNavigate={handleBottomNav} />;
       
       case 'master-dashboard':
         return <MasterDashboardScreen onNavigateToHome={() => setCurrentScreen('dashboard-paciente')} />;
       
       default:
        return <UserTypeSelection onSelectRole={handleSelectRole} />;
    }
  };

  return (
    <>
      {renderScreen()}
      <Toast message={toastMessage} isVisible={showToast} onClose={() => setShowToast(false)} />
    </>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
