import { Article, Availability, Doctor, GlossaryItem, Laboratory, Pharmacy } from '../types';

export interface Profile {
  id: string;
  email: string;
  name: string;
  surname: string;
  image_url: string;
  phone: string;
  type: 'Paciente' | 'Medico' | 'Farmacia' | 'Laboratorio' | 'Admin';
  created_at: string;
  updated_at: string;
}

export interface Patient {
  id: number;
  profile_id: string;
  phone: string;
  birthDate: string;
  gender: string;
  weight: number;
  height: number;
  address: string;
  city: string;
  country: string;
  bloodType: string;
  allergies: string;
}

export interface DoctorRecord {
  id: string;
  profile_id: string;
  specialty: string;
  license: string;
  experienceYears: number;
  consultationPrice: number;
  insuranceAffiliations: string;
  bio: string;
  city: string;
  address: string;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED';
  availability: Availability[];
  slotDuration: number;
  identityDocUrl: string;
  professionalTitleUrl: string;
  imageUrl: string;
}

export interface PharmacyRecord {
  id: number;
  profile_id: string;
  business_name: string;
  address: string;
  city: string;
  openingHours: string;
  closingHours: string;
  hasDelivery: boolean;
  image_url: string;
  description: string;
  phone: string;
  rating: number;
  reviews: number;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED';
}

export interface LaboratoryRecord {
  id: number;
  profile_id: string;
  business_name: string;
  address: string;
  city: string;
  openingHours: string;
  closingHours: string;
  image_url: string;
  description: string;
  phone: string;
  rating: number;
  reviews: number;
  status: 'PENDING' | 'VERIFIED' | 'APPROVED' | 'REJECTED';
}

export interface BookingRecord {
  id: string;
  doctor_id: string;
  patient_id: number;
  date: string;
  status: 'pending' | 'upcoming' | 'confirmed' | 'completed' | 'cancelled';
  price: number;
  type: string;
  notes: string;
}

export interface MockUser {
  email: string;
  password: string;
  profileId: string;
}

export const HARDCODED_PROFILES: Profile[] = [
  {
    id: 'patient-1',
    email: 'paciente@drgoyo.com',
    name: 'Juan',
    surname: 'Pérez',
    image_url: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&q=80&w=300',
    phone: '0412-111-2222',
    type: 'Paciente',
    created_at: '2026-01-10T12:00:00.000Z',
    updated_at: '2026-06-17T12:00:00.000Z'
  },
  {
    id: 'doctor-1-profile',
    email: 'doctor@drgoyo.com',
    name: 'Pedro',
    surname: 'León',
    image_url: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300',
    phone: '0414-333-4444',
    type: 'Medico',
    created_at: '2026-01-11T12:00:00.000Z',
    updated_at: '2026-06-17T12:00:00.000Z'
  },
  {
    id: 'pharmacy-1-profile',
    email: 'farmacia@drgoyo.com',
    name: 'Farmacia Central',
    surname: '',
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=300',
    phone: '0212-555-1010',
    type: 'Farmacia',
    created_at: '2026-01-12T12:00:00.000Z',
    updated_at: '2026-06-17T12:00:00.000Z'
  },
  {
    id: 'lab-1-profile',
    email: 'laboratorio@drgoyo.com',
    name: 'Laboratorio VidaLab',
    surname: '',
    image_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=300',
    phone: '0212-999-1111',
    type: 'Laboratorio',
    created_at: '2026-01-13T12:00:00.000Z',
    updated_at: '2026-06-17T12:00:00.000Z'
  },
  {
    id: 'admin-1',
    email: 'miguelbrit@gmail.com',
    name: 'Miguel',
    surname: 'Brito',
    image_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300',
    phone: '0412-000-0000',
    type: 'Admin',
    created_at: '2026-01-01T12:00:00.000Z',
    updated_at: '2026-06-17T12:00:00.000Z'
  }
];

export const HARDCODED_PATIENTS: Patient[] = [
  {
    id: 1,
    profile_id: 'patient-1',
    phone: '0412-111-2222',
    birthDate: '1990-05-15',
    gender: 'Masculino',
    weight: 78,
    height: 175,
    address: 'Av. Principal',
    city: 'Caracas',
    country: 'Venezuela',
    bloodType: 'O+',
    allergies: 'Ninguna'
  }
];

export const HARDCODED_DOCTORS: DoctorRecord[] = [
  {
    id: 'doctor-1',
    profile_id: 'doctor-1-profile',
    specialty: 'Cardiólogo',
    license: 'V-12345678',
    experienceYears: 12,
    consultationPrice: 80,
    insuranceAffiliations: 'Mapfre, Mercantil',
    bio: 'Especialista en salud cardiovascular con enfoque en prevención y tratamiento de hipertensión.',
    city: 'Caracas',
    address: 'Av. Francisco de Miranda, Chacao',
    status: 'VERIFIED',
    availability: [
      { dayOfWeek: 1, startTime: '08:00', endTime: '12:00', isActive: true },
      { dayOfWeek: 1, startTime: '14:00', endTime: '18:00', isActive: true },
      { dayOfWeek: 2, startTime: '08:00', endTime: '12:00', isActive: true },
      { dayOfWeek: 3, startTime: '09:00', endTime: '13:00', isActive: true },
      { dayOfWeek: 4, startTime: '14:00', endTime: '18:00', isActive: true },
      { dayOfWeek: 5, startTime: '08:00', endTime: '12:00', isActive: true }
    ],
    slotDuration: 30,
    identityDocUrl: '',
    professionalTitleUrl: '',
    imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300'
  }
];

export const HARDCODED_PHARMACIES: PharmacyRecord[] = [
  {
    id: 1,
    profile_id: 'pharmacy-1-profile',
    business_name: 'Farmacia Central',
    address: 'Av. Principal con Calle 2',
    city: 'Caracas',
    openingHours: '08:00',
    closingHours: '20:00',
    hasDelivery: true,
    image_url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=300',
    description: 'Farmacia de turno con delivery y asesoría farmacéutica.',
    phone: '0212-555-1010',
    rating: 4.8,
    reviews: 180,
    status: 'VERIFIED'
  }
];

export const HARDCODED_LABORATORIES: LaboratoryRecord[] = [
  {
    id: 1,
    profile_id: 'lab-1-profile',
    business_name: 'Laboratorio VidaLab',
    address: 'Av. Francisco de Miranda, Chacao',
    city: 'Caracas',
    openingHours: '07:00',
    closingHours: '17:00',
    image_url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=300',
    description: 'Laboratorio clínico con resultados rápidos.',
    phone: '0212-999-1111',
    rating: 4.6,
    reviews: 120,
    status: 'VERIFIED'
  }
];

export const HARDCODED_DOCTORS_PUBLIC: Doctor[] = [
  {
    id: 'doctor-1',
    name: 'Dr. Pedro León',
    specialty: 'Cardiólogo',
    location: 'Caracas',
    distance: '2.5 km',
    rating: 4.5,
    reviews: 84,
    price: 80,
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Hoy, 3:00 PM',
    about: 'Especialista en salud cardiovascular con enfoque en prevención y tratamiento de hipertensión. Egresado de la UCV con postgrado en España.',
    experience: 12,
    patients: 1500,
    isFeatured: true,
    availability: HARDCODED_DOCTORS[0].availability
  },
  {
    id: 'doctor-2',
    name: 'Dra. Lucia Mendez',
    specialty: 'Pediatra',
    location: 'Zulia',
    distance: '5.0 km',
    rating: 4.7,
    reviews: 120,
    price: 60,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Mañana, 9:00 AM',
    about: 'Atención integral para niños y adolescentes. Experta en desarrollo infantil y nutrición pediátrica.',
    experience: 8,
    patients: 950
  },
  {
    id: 'doctor-3',
    name: 'Dr. Julian Lopez',
    specialty: 'Nutricionista',
    location: 'Bolivar',
    distance: '1.8 km',
    rating: 4.3,
    reviews: 45,
    price: 45,
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300',
    nextAvailable: 'Hoy, 5:00 PM',
    about: 'Planes nutricionales personalizados para control de peso, diabetes y rendimiento deportivo.',
    experience: 5,
    patients: 400
  }
];

export const HARDCODED_PHARMACIES_PUBLIC: Pharmacy[] = [
  {
    id: 'pharmacy-1',
    name: 'Farmacia Central',
    address: 'Av. Principal con Calle 2',
    location: 'Caracas',
    rating: 4.8,
    reviews: 180,
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=800',
    distance: '1.2 km',
    isOpen: true,
    inventory: [
      { id: 'med-1', name: 'Amoxicilina 500mg', price: 4, available: true },
      { id: 'med-2', name: 'Ibuprofeno 400mg', price: 3, available: true }
    ],
    phone: '0212-555-1010',
    hours: '08:00 AM - 08:00 PM',
    description: 'Farmacia de turno con delivery.'
  },
  {
    id: 'pharmacy-2',
    name: 'Farmacia del Este',
    address: 'Calle 15, El Cafetal',
    location: 'Caracas',
    rating: 4.6,
    reviews: 92,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
    distance: '3.4 km',
    isOpen: true,
    inventory: [
      { id: 'med-3', name: 'Paracetamol 500mg', price: 2, available: true }
    ],
    phone: '0212-555-2020',
    hours: '07:00 AM - 10:00 PM',
    description: 'Medicinas, vitaminas y productos de cuidado personal.'
  }
];

export const HARDCODED_LABS_PUBLIC: Laboratory[] = [
  {
    id: 'lab-1',
    name: 'Laboratorio VidaLab',
    location: 'Caracas',
    address: 'Av. Francisco de Miranda, Chacao',
    rating: 4.6,
    reviews: 120,
    distance: '2.3 km',
    image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=400',
    services: [
      { id: 's1', name: 'Hematología Completa', price: 25, preparation: 'Ayuno no requerido', duration: '24 horas' },
      { id: 's2', name: 'Perfil Lipídico', price: 40, preparation: 'Ayuno 12 horas', duration: '24 horas' },
      { id: 's3', name: 'Perfil Tiroideo', price: 55, preparation: 'Ayuno 8 horas', duration: '48 horas' }
    ],
    hours: '7:00 AM - 5:00 PM',
    phone: '0212-999-1111'
  },
  {
    id: 'lab-2',
    name: 'Zulia Diagnósticos',
    location: 'Maracaibo',
    address: 'Av. 5 de Julio',
    rating: 4.8,
    reviews: 210,
    distance: '4.1 km',
    image: '/imagenes/laboratorio_zulia.jpg',
    services: [
      { id: 's1', name: 'Hematología Completa', price: 25, preparation: 'Ayuno no requerido', duration: '24 horas' },
      { id: 's4', name: 'Rayos X de Tórax', price: 35, preparation: 'Ninguna', duration: 'Entrega inmediata' }
    ],
    hours: '6:30 AM - 6:00 PM',
    phone: '0261-999-2222'
  }
];

export const HARDCODED_BOOKINGS: BookingRecord[] = [
  {
    id: 'booking-1',
    doctor_id: 'doctor-1',
    patient_id: 1,
    date: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'upcoming',
    price: 80,
    type: 'Consulta Médica',
    notes: 'Cita de control cardiovascular'
  }
];

export const HARDCODED_ARTICLES: Article[] = [
  {
    id: 'article-1',
    title: 'Cómo prevenir la hipertensión arterial',
    subtitle: 'Consejos prácticos para cuidar tu presión',
    intro: 'La hipertensión puede controlarse con hábitos diarios.',
    category: 'Salud Cardiovascular',
    subcategories: 'Prevención, Corazón',
    tags: 'hipertensión, corazón, prevención',
    author: 'Dr. Pedro León',
    status: 'published',
    publishDate: '2026-06-10T12:00:00.000Z',
    views: 1240,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800',
    content: '<p>Contenido educativo de ejemplo para la biblioteca médica.</p>'
  },
  {
    id: 'article-2',
    title: 'Uso correcto de antibióticos',
    subtitle: 'Evita la automedicación',
    intro: 'Los antibióticos solo deben usarse bajo indicación médica.',
    category: 'Medicamentos',
    subcategories: 'Antibióticos',
    tags: 'antibióticos, automedicación',
    author: 'Farmacia Central',
    status: 'published',
    publishDate: '2026-06-05T12:00:00.000Z',
    views: 830,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=800',
    content: '<p>Contenido educativo de ejemplo sobre medicamentos.</p>'
  }
];

export const HARDCODED_GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: 'glossary-1',
    term: 'Amoxicilina',
    type: 'MEDICINE',
    description: 'Antibiótico usado para tratar infecciones bacterianas.',
    category: 'Antibiótico',
    status: 'PUBLISHED',
    createdAt: '2026-06-01T12:00:00.000Z',
    updatedAt: '2026-06-01T12:00:00.000Z'
  },
  {
    id: 'glossary-2',
    term: 'Hipertensión',
    type: 'PATHOLOGY',
    description: 'Presión arterial elevada de forma sostenida.',
    category: 'Cardiología',
    status: 'PUBLISHED',
    createdAt: '2026-06-02T12:00:00.000Z',
    updatedAt: '2026-06-02T12:00:00.000Z'
  },
  {
    id: 'glossary-3',
    term: 'Hemograma',
    type: 'PRE_OP_LIST',
    description: 'Examen de laboratorio que evalúa células sanguíneas.',
    category: 'Pre-operatorio',
    status: 'PUBLISHED',
    createdAt: '2026-06-03T12:00:00.000Z',
    updatedAt: '2026-06-03T12:00:00.000Z'
  }
];

export const HARDCODED_USERS: MockUser[] = [
  { email: 'paciente@drgoyo.com', password: '123456', profileId: 'patient-1' },
  { email: 'doctor@drgoyo.com', password: '123456', profileId: 'doctor-1-profile' },
  { email: 'farmacia@drgoyo.com', password: '123456', profileId: 'pharmacy-1-profile' },
  { email: 'laboratorio@drgoyo.com', password: '123456', profileId: 'lab-1-profile' },
  { email: 'miguelbrit@gmail.com', password: '123456', profileId: 'admin-1' },
  { email: 'admin@drgoyo.com', password: '123456', profileId: 'admin-1' }
];

export const mockPharmacies = [
  { id: 1, name: "Farmacia Central 'El Sol'", city: 'Caracas', rating: 4.8, services: ['Delivery 24h', 'Inyectología'], image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=400&q=80' },
  { id: 2, name: "Droguería 'La Esperanza'", city: 'Mérida', rating: 4.5, services: ['Genéricos', 'Toma de presión'], image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80' },
  { id: 3, name: "Farmatodo 'Los Andes'", city: 'Maracaibo', rating: 4.9, services: ['Perfumería', 'Artículos de bebé'], image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&w=400&q=80' },
  { id: 4, name: "Farmacia 'San Juan'", city: 'San Cristóbal', rating: 4.6, services: ['Fórmulas magistrales', 'Oxígeno'], image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=400&q=80' },
  { id: 5, name: "Droguería 'Valencia Sur'", city: 'Valencia', rating: 4.7, services: ['Delivery rápido', 'Equipos médicos'], image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=400&q=80' },
  { id: 6, name: "Farmacia 'El Centro'", city: 'Maracay', rating: 4.8, services: ['Atención farmacéutica', 'Vacunación'], image: 'https://images.unsplash.com/photo-1563213326-d47a9432ab38?auto=format&fit=crop&w=400&q=80' }
];

export const mockDoctors = [
  { id: 1, name: 'Dr. Alejandro Mendoza', specialty: 'Cardiología', city: 'Caracas', rating: 4.9, reviews: 120, image: 'https://randomuser.me/api/portraits/men/32.jpg', bio: 'Cardiólogo egresado de la UCV con especialización en hemodinamia. Enfocado en la prevención y tratamiento de hipertensión arterial y enfermedades cardiovasculares.', experience: 12, patients: 1500 },
  { id: 2, name: 'Dra. Valentina Soto', specialty: 'Ginecología', city: 'Mérida', rating: 4.8, reviews: 95, image: 'https://randomuser.me/api/portraits/women/44.jpg', bio: 'Ginecóloga con amplia experiencia en obstetricia, planificación familiar y salud reproductiva. Atención integral para la mujer en todas las etapas de su vida.', experience: 10, patients: 2200 },
  { id: 3, name: 'Dr. Javier Ríos', specialty: 'Pediatría', city: 'Maracaibo', rating: 4.7, reviews: 150, image: 'https://randomuser.me/api/portraits/men/85.jpg', bio: 'Pediatra dedicado al cuidado de la salud infantil. Experto en desarrollo infantil temprano, nutrición pediátrica y enfermedades respiratorias en niños.', experience: 8, patients: 3200 },
  { id: 4, name: 'Dra. Gabriela Márquez', specialty: 'Dermatología', city: 'San Cristóbal', rating: 5.0, reviews: 80, image: 'https://randomuser.me/api/portraits/women/65.jpg', bio: 'Dermatóloga especializada en diagnóstico y tratamiento de enfermedades de la piel. Experta en dermatoscopia, cirugía dermatológica y estética.', experience: 9, patients: 1800 },
  { id: 5, name: 'Dr. Luis Eduardo Paredes', specialty: 'Traumatología', city: 'Valencia', rating: 4.6, reviews: 110, image: 'https://randomuser.me/api/portraits/men/22.jpg', bio: 'Traumatólogo con experiencia en lesiones deportivas, cirugía ortopédica y rehabilitación. Tratamiento integral de fracturas y patologías articulares.', experience: 15, patients: 2800 },
  { id: 6, name: 'Dra. Isabella Fernández', specialty: 'Medicina Interna', city: 'Maracay', rating: 4.9, reviews: 130, image: 'https://randomuser.me/api/portraits/women/28.jpg', bio: 'Internista con enfoque en prevención y manejo de enfermedades crónicas. Atención integral del adulto con énfasis en diagnóstico temprano y tratamiento personalizado.', experience: 11, patients: 1900 }
];

const roleFromProfileType = (type: Profile['type']) => {
  if (type === 'Paciente') return 'patient';
  if (type === 'Medico') return 'doctor';
  if (type === 'Farmacia') return 'pharmacy';
  if (type === 'Laboratorio') return 'lab';
  return 'admin';
};

const safeLocalStorage = {
  get: (key: string) => {
    if (typeof window === 'undefined') return null;
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  set: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.setItem(key, value); } catch {}
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    try { window.localStorage.removeItem(key); } catch {}
  }
};

export const findProfile = (profileId: string) => HARDCODED_PROFILES.find(profile => profile.id === profileId) || null;
export const findProfileByEmail = (email: string) => HARDCODED_PROFILES.find(profile => profile.email.toLowerCase() === email.toLowerCase()) || null;

export const resolveProfileFromToken = (token?: string | null) => {
  if (!token) return null;

  const storedSession = safeLocalStorage.get('mock_supabase_session');
  if (storedSession) {
    try {
      const session = JSON.parse(storedSession) as { access_token?: string; user?: { id?: string } };
      if (session.access_token === token && session.user?.id) {
        return findProfile(session.user.id);
      }
    } catch {}
  }

  const knownUser = HARDCODED_USERS.find(user => user.profileId === token.replace('mock-', '') || `mock-${user.profileId}` === token);
  if (knownUser) return findProfile(knownUser.profileId);

  return null;
};

export const createSessionForProfileId = (profileId: string) => {
  const profile = findProfile(profileId);
  if (!profile) throw new Error('Perfil no encontrado');

  const token = `mock-${profileId}`;
  const session = {
    access_token: token,
    refresh_token: '',
    expires_at: Math.floor(Date.now() / 1000) + 86400,
    user: {
      id: profile.id,
      email: profile.email,
      user_metadata: {
        name: profile.name,
        surname: profile.surname,
        type: profile.type,
        role: roleFromProfileType(profile.type)
      }
    }
  };

  safeLocalStorage.set('mock_supabase_session', JSON.stringify(session));
  safeLocalStorage.set('token', token);
  safeLocalStorage.set('user_role', roleFromProfileType(profile.type));
  safeLocalStorage.set('user_name', profile.surname ? `${profile.name} ${profile.surname}` : profile.name);
  return session;
};

export const getCurrentSession = () => {
  const storedSession = safeLocalStorage.get('mock_supabase_session');
  if (!storedSession) return null;
  try { return JSON.parse(storedSession); } catch { return null; }
};

export const profileWithRelations = (profile: Profile) => ({
  ...profile,
  patient: HARDCODED_PATIENTS.find(patient => patient.profile_id === profile.id) || null,
  doctor: HARDCODED_DOCTORS.find(doctor => doctor.profile_id === profile.id) || null,
  pharmacy: HARDCODED_PHARMACIES.find(pharmacy => pharmacy.profile_id === profile.id) || null,
  laboratory: HARDCODED_LABORATORIES.find(laboratory => laboratory.profile_id === profile.id) || null
});

export const doctorPublicFromRecord = (doctor: DoctorRecord): Doctor => {
  const profile = findProfile(doctor.profile_id);
  return {
    id: doctor.id,
    name: `${profile?.name || ''} ${profile?.surname || ''}`.trim() || 'Médico',
    specialty: doctor.specialty,
    location: doctor.city,
    distance: doctor.address ? 'Presencial' : 'Telemedicina',
    rating: 5,
    reviews: 0,
    price: doctor.consultationPrice,
    image: profile?.image_url || doctor.imageUrl || null,
    nextAvailable: doctor.status === 'VERIFIED' || doctor.status === 'APPROVED' ? 'Disponible' : 'En Verificación',
    about: doctor.bio,
    experience: doctor.experienceYears,
    patients: 0,
    isFeatured: doctor.status === 'VERIFIED' || doctor.status === 'APPROVED',
    availability: doctor.availability
  };
};

export const pharmacyPublicFromRecord = (pharmacy: PharmacyRecord): Pharmacy => ({
  id: `pharmacy-${pharmacy.id}`,
  name: pharmacy.business_name,
  address: pharmacy.address,
  location: pharmacy.city,
  rating: pharmacy.rating,
  reviews: pharmacy.reviews,
  image: pharmacy.image_url,
  distance: '--',
  isOpen: true,
  inventory: [],
  phone: pharmacy.phone,
  hours: `${pharmacy.openingHours} - ${pharmacy.closingHours}`,
  description: pharmacy.description
});

export const laboratoryPublicFromRecord = (laboratory: LaboratoryRecord): Laboratory => ({
  id: `lab-${laboratory.id}`,
  name: laboratory.business_name,
  location: laboratory.city,
  address: laboratory.address,
  rating: laboratory.rating,
  reviews: laboratory.reviews,
  distance: '--',
  image: laboratory.image_url,
  services: [
    { id: 's1', name: 'Hematología Completa', price: 25, preparation: 'Ayuno no requerido', duration: '24 horas' },
    { id: 's2', name: 'Perfil Lipídico', price: 40, preparation: 'Ayuno 12 horas', duration: '24 horas' },
    { id: 's3', name: 'Perfil Tiroideo', price: 55, preparation: 'Ayuno 8 horas', duration: '48 horas' }
  ],
  hours: `${laboratory.openingHours} - ${laboratory.closingHours}`,
  phone: laboratory.phone
});

export const removeStoredSession = () => {
  safeLocalStorage.remove('mock_supabase_session');
  safeLocalStorage.remove('token');
  safeLocalStorage.remove('user_role');
  safeLocalStorage.remove('user_name');
};
