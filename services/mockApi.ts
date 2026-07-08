import {
  createSessionForProfileId,
  findProfile,
  findProfileByEmail,
  HARDCODED_BOOKINGS,
  HARDCODED_DOCTORS,
  HARDCODED_LABORATORIES,
  HARDCODED_PATIENTS,
  HARDCODED_PHARMACIES,
  HARDCODED_PROFILES,
  profileWithRelations,
  removeStoredSession,
  resolveProfileFromToken
} from '../data/mockData';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

const ok = <T,>(data: T): ApiResponse<T> => ({ success: true, data });
const fail = (message: string, status = 400): ApiResponse<never> => ({ success: false, error: message, message });

const getProfileFromToken = (token?: string | null) => {
  const profile = resolveProfileFromToken(token);
  if (!profile) throw new Error('No autenticado');
  return profile;
};

const normalizeRole = (role: string) => {
  if (role === 'lab') return 'laboratorio';
  return role;
};

export const mockApi = {
  getUserProfile: async (token?: string | null): Promise<ApiResponse<any>> => {
    try {
      const profile = getProfileFromToken(token);
      return ok(profileWithRelations(profile));
    } catch (error: any) {
      return fail(error.message || 'Error al cargar perfil');
    }
  },

  updateUserProfile: async (token: string | null | undefined, payload: Record<string, any>): Promise<ApiResponse<any>> => {
    try {
      const profile = getProfileFromToken(token);
      const patient = HARDCODED_PATIENTS.find(item => item.profile_id === profile.id);
      const doctor = HARDCODED_DOCTORS.find(item => item.profile_id === profile.id);
      const pharmacy = HARDCODED_PHARMACIES.find(item => item.profile_id === profile.id);
      const laboratory = HARDCODED_LABORATORIES.find(item => item.profile_id === profile.id);

      if (payload.name !== undefined) profile.name = payload.name;
      if (payload.surname !== undefined) profile.surname = payload.surname;
      if (payload.email !== undefined) profile.email = payload.email;
      if (payload.phone !== undefined) profile.phone = payload.phone;
      if (payload.imageUrl !== undefined || payload.image_url !== undefined) {
        profile.image_url = payload.imageUrl ?? payload.image_url;
      }

      if (patient && payload.phone !== undefined) patient.phone = payload.phone;
      if (patient && payload.birthDate !== undefined) patient.birthDate = payload.birthDate;
      if (patient && payload.gender !== undefined) patient.gender = payload.gender;
      if (patient && payload.weight !== undefined) patient.weight = Number(payload.weight) || patient.weight;
      if (patient && payload.height !== undefined) patient.height = Number(payload.height) || patient.height;
      if (patient && payload.address !== undefined) patient.address = payload.address;
      if (patient && payload.city !== undefined) patient.city = payload.city;
      if (patient && payload.country !== undefined) patient.country = payload.country;
      if (patient && payload.bloodType !== undefined) patient.bloodType = payload.bloodType;
      if (patient && payload.allergies !== undefined) patient.allergies = payload.allergies;

      if (doctor) {
        if (payload.specialty !== undefined) doctor.specialty = payload.specialty;
        if (payload.license !== undefined) doctor.license = payload.license;
        if (payload.experienceYears !== undefined) doctor.experienceYears = Number(payload.experienceYears) || doctor.experienceYears;
        if (payload.consultationPrice !== undefined) doctor.consultationPrice = Number(payload.consultationPrice) || doctor.consultationPrice;
        if (payload.insuranceAffiliations !== undefined) doctor.insuranceAffiliations = payload.insuranceAffiliations;
        if (payload.bio !== undefined) doctor.bio = payload.bio;
        if (payload.city !== undefined) doctor.city = payload.city;
        if (payload.address !== undefined) doctor.address = payload.address;
        if (payload.availability !== undefined) doctor.availability = payload.availability;
        if (payload.slotDuration !== undefined) doctor.slotDuration = payload.slotDuration;
        if (payload.identityDocUrl !== undefined) doctor.identityDocUrl = payload.identityDocUrl;
        if (payload.professionalTitleUrl !== undefined) doctor.professionalTitleUrl = payload.professionalTitleUrl;
      }

      if (pharmacy) {
        if (payload.businessName !== undefined || payload.name !== undefined) {
          pharmacy.business_name = payload.businessName ?? payload.name;
        }
        if (payload.address !== undefined) pharmacy.address = payload.address;
        if (payload.city !== undefined) pharmacy.city = payload.city;
        if (payload.openingHours !== undefined) pharmacy.openingHours = payload.openingHours;
        if (payload.closingHours !== undefined) pharmacy.closingHours = payload.closingHours;
        if (payload.hasDelivery !== undefined) pharmacy.hasDelivery = payload.hasDelivery;
        if (payload.imageUrl !== undefined || payload.image_url !== undefined) {
          pharmacy.image_url = payload.imageUrl ?? payload.image_url;
        }
        if (payload.description !== undefined) pharmacy.description = payload.description;
        if (payload.phone !== undefined) pharmacy.phone = payload.phone;
      }

      if (laboratory) {
        if (payload.businessName !== undefined || payload.name !== undefined) {
          laboratory.business_name = payload.businessName ?? payload.name;
        }
        if (payload.address !== undefined) laboratory.address = payload.address;
        if (payload.city !== undefined) laboratory.city = payload.city;
        if (payload.openingHours !== undefined) laboratory.openingHours = payload.openingHours;
        if (payload.closingHours !== undefined) laboratory.closingHours = payload.closingHours;
        if (payload.imageUrl !== undefined || payload.image_url !== undefined) {
          laboratory.image_url = payload.imageUrl ?? payload.image_url;
        }
        if (payload.description !== undefined) laboratory.description = payload.description;
        if (payload.phone !== undefined) laboratory.phone = payload.phone;
      }

      profile.updated_at = new Date().toISOString();
      return ok(profileWithRelations(profile));
    } catch (error: any) {
      return fail(error.message || 'Error al actualizar perfil');
    }
  },

  registerUser: async (payload: Record<string, any>): Promise<ApiResponse<any>> => {
    try {
      const existing = findProfileByEmail(payload.email);
      if (existing) {
        const session = createSessionForProfileId(existing.id);
        return ok({
          token: session.access_token,
          user: {
            role: existing.type === 'Paciente' ? 'patient' : existing.type === 'Medico' ? 'doctor' : existing.type === 'Farmacia' ? 'pharmacy' : 'lab',
            name: existing.surname ? `${existing.name} ${existing.surname}` : existing.name
          }
        });
      }

      const role = normalizeRole(payload.type?.toLowerCase?.() || 'patient');
      const profileId = `${role}-${Date.now()}`;
      const profileType = role === 'patient' ? 'Paciente' : role === 'doctor' ? 'Medico' : role === 'pharmacy' ? 'Farmacia' : role === 'lab' ? 'Laboratorio' : 'Admin';
      const name = payload.name || (role === 'pharmacy' || role === 'lab' ? 'Negocio' : 'Usuario');
      const surname = payload.surname || '';

      HARDCODED_PROFILES.push({
        id: profileId,
        email: payload.email,
        name,
        surname,
        image_url: '',
        phone: payload.phone || '',
        type: profileType,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (role === 'patient') {
        HARDCODED_PATIENTS.push({
          id: HARDCODED_PATIENTS.length + 1,
          profile_id: profileId,
          phone: payload.phone || '',
          birthDate: payload.birthDate || '',
          gender: payload.gender || '',
          weight: Number(payload.weight) || 0,
          height: Number(payload.height) || 0,
          address: payload.address || '',
          city: payload.city || '',
          country: payload.country || 'Venezuela',
          bloodType: '',
          allergies: ''
        });
      }

      if (role === 'doctor') {
        HARDCODED_DOCTORS.push({
          id: `doctor-${Date.now()}`,
          profile_id: profileId,
          specialty: payload.specialty || 'General',
          license: payload.license || '',
          experienceYears: Number(payload.experienceYears) || 0,
          consultationPrice: Number(payload.consultationPrice) || 0,
          insuranceAffiliations: payload.insuranceAffiliations || '',
          bio: payload.bio || '',
          city: payload.city || '',
          address: payload.address || '',
          status: 'PENDING',
          availability: [],
          slotDuration: 30,
          identityDocUrl: '',
          professionalTitleUrl: '',
          imageUrl: ''
        });
      }

      if (role === 'pharmacy') {
        HARDCODED_PHARMACIES.push({
          id: HARDCODED_PHARMACIES.length + 1,
          profile_id: profileId,
          business_name: name,
          address: payload.address || '',
          city: payload.city || '',
          openingHours: payload.openingHours || '',
          closingHours: payload.closingHours || '',
          hasDelivery: Boolean(payload.hasDelivery),
          image_url: '',
          description: '',
          phone: payload.phone || '',
          rating: 0,
          reviews: 0,
          status: 'PENDING'
        });
      }

      if (role === 'lab') {
        HARDCODED_LABORATORIES.push({
          id: HARDCODED_LABORATORIES.length + 1,
          profile_id: profileId,
          business_name: name,
          address: payload.address || '',
          city: payload.city || '',
          openingHours: payload.openingHours || '',
          closingHours: payload.closingHours || '',
          image_url: '',
          description: '',
          phone: payload.phone || '',
          rating: 0,
          reviews: 0,
          status: 'PENDING'
        });
      }

      const session = createSessionForProfileId(profileId);
      return ok({
        token: session.access_token,
        user: {
          role,
          name: surname ? `${name} ${surname}` : name
        }
      });
    } catch (error: any) {
      return fail(error.message || 'Error al registrar usuario');
    }
  },

  forgotPassword: async (): Promise<ApiResponse<{ sent: boolean }>> => ok({ sent: true }),

  resetPassword: async (): Promise<ApiResponse<{ reset: boolean }>> => ok({ reset: true }),

  getDoctorAvailability: async (doctorId: string): Promise<ApiResponse<any>> => {
    const doctor = HARDCODED_DOCTORS.find(item => item.id === doctorId);
    if (!doctor) return fail('Médico no encontrado', 404);

    return ok({
      doctor: {
        id: doctor.id,
        availability: doctor.availability,
        slotDuration: doctor.slotDuration
      },
      appointments: HARDCODED_BOOKINGS.filter(booking => booking.doctor_id === doctor.id)
    });
  },

  bookAppointment: async (token: string | null | undefined, payload: Record<string, any>): Promise<ApiResponse<any>> => {
    try {
      const profile = getProfileFromToken(token);
      const doctor = HARDCODED_DOCTORS.find(item => item.id === payload.doctorId);
      if (!doctor) return fail('Médico no encontrado', 404);

      let patient = HARDCODED_PATIENTS.find(item => item.profile_id === profile.id);
      if (!patient) {
        patient = {
          id: HARDCODED_PATIENTS.length + 1,
          profile_id: profile.id,
          phone: profile.phone || '',
          birthDate: '',
          gender: '',
          weight: 0,
          height: 0,
          address: '',
          city: '',
          country: 'Venezuela',
          bloodType: '',
          allergies: ''
        };
        HARDCODED_PATIENTS.push(patient);
      }

      const booking = {
        id: `booking-${Date.now()}`,
        doctor_id: doctor.id,
        patient_id: patient.id,
        date: payload.date,
        status: 'upcoming',
        price: Number(payload.price) || doctor.consultationPrice,
        type: payload.type || 'Consulta Médica',
        notes: payload.notes || 'Cita reservada desde el frontend local'
      };
      HARDCODED_BOOKINGS.push(booking);
      return ok(booking);
    } catch (error: any) {
      return fail(error.message || 'Error al agendar cita');
    }
  },

  getAdminStats: async (): Promise<ApiResponse<any>> => {
    const doctors = HARDCODED_DOCTORS;
    const pharmacies = HARDCODED_PHARMACIES;
    const labs = HARDCODED_LABORATORIES;

    return ok({
      patients: HARDCODED_PATIENTS.length,
      doctors: {
        total: doctors.length,
        verified: doctors.filter(item => item.status === 'VERIFIED' || item.status === 'APPROVED').length,
        pending: doctors.filter(item => item.status === 'PENDING').length
      },
      pharmacies: {
        total: pharmacies.length,
        verified: pharmacies.filter(item => item.status === 'VERIFIED' || item.status === 'APPROVED').length,
        pending: pharmacies.filter(item => item.status === 'PENDING').length
      },
      labs: {
        total: labs.length,
        verified: labs.filter(item => item.status === 'VERIFIED' || item.status === 'APPROVED').length,
        pending: labs.filter(item => item.status === 'PENDING').length
      }
    });
  },

  getPendingApprovals: async (): Promise<ApiResponse<any[]>> => {
    const pending = [
      ...HARDCODED_DOCTORS.filter(item => item.status === 'PENDING').map(item => ({ id: item.id, type: 'Doctor', name: findProfile(item.profile_id)?.name || 'Médico', status: item.status })),
      ...HARDCODED_PHARMACIES.filter(item => item.status === 'PENDING').map(item => ({ id: String(item.id), type: 'Pharmacy', name: item.business_name, status: item.status })),
      ...HARDCODED_LABORATORIES.filter(item => item.status === 'PENDING').map(item => ({ id: String(item.id), type: 'Laboratory', name: item.business_name, status: item.status }))
    ];
    return ok(pending);
  },

  updateApproval: async (payload: { entityId: string; entityType: string; status: 'VERIFIED' | 'REJECTED' }): Promise<ApiResponse<any>> => {
    if (payload.entityType === 'Doctor') {
      const doctor = HARDCODED_DOCTORS.find(item => item.id === payload.entityId);
      if (doctor) doctor.status = payload.status;
    }

    if (payload.entityType === 'Pharmacy') {
      const pharmacy = HARDCODED_PHARMACIES.find(item => String(item.id) === payload.entityId);
      if (pharmacy) pharmacy.status = payload.status;
    }

    if (payload.entityType === 'Laboratory') {
      const laboratory = HARDCODED_LABORATORIES.find(item => String(item.id) === payload.entityId);
      if (laboratory) laboratory.status = payload.status;
    }

    return ok({ updated: true });
  },

  signOut: async (): Promise<ApiResponse<{ signedOut: boolean }>> => {
    removeStoredSession();
    return ok({ signedOut: true });
  }
};
