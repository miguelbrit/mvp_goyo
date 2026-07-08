import { supabase } from '../supabase';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  surname: string;
  image_url: string;
  phone: string;
  type: string;
  created_at: string;
  updated_at: string;
  patient?: PatientData | null;
  doctor?: DoctorData | null;
  pharmacy?: PharmacyData | null;
  laboratory?: LaboratoryData | null;
}

export interface PatientData {
  id: number;
  profile_id: string;
  phone: string;
  birthDate: string | null;
  gender: string | null;
  weight: number | null;
  height: number | null;
  address: string | null;
  city: string | null;
  country: string | null;
  bloodType: string | null;
  allergies: string | null;
}

export interface DoctorData {
  id: number;
  profile_id: string;
  specialty: string;
  license: string;
}

export interface PharmacyData {
  id: number;
  profile_id: string;
  business_name: string;
}

export interface LaboratoryData {
  id: number;
  profile_id: string;
  business_name: string;
}

export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data: profile, error: profileError } = await supabase
      .from('Profile')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.warn('[profileService] Error fetching profile:', profileError.message);
      if (profileError.code === 'PGRST116') {
        return null;
      }
      return null;
    }

    if (!profile) {
      console.warn('[profileService] No profile found for user:', userId);
      return null;
    }

    let patientData: PatientData | null = null;
    let role = profile.type?.toLowerCase() || 'patient';

    if (role === 'patient') {
      const { data: patient, error: patientError } = await supabase
        .from('Patient')
        .select('*')
        .eq('profile_id', userId)
        .single();

      if (!patientError && patient) {
        patientData = patient;
      }
    }

    return {
      ...profile,
      patient: patientData,
    };
  } catch (err: any) {
    console.error('[profileService] Critical error:', err);
    return null;
  }
};

export const fetchPatientData = async (profileId: string): Promise<PatientData | null> => {
  try {
    const { data, error } = await supabase
      .from('Patient')
      .select('*')
      .eq('profile_id', profileId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      return null;
    }

    return data;
  } catch (err) {
    console.error('[profileService] Error in fetchPatientData:', err);
    return null;
  }
};
