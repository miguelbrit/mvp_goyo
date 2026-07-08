import React, { useState, useRef, useEffect } from 'react';
import { 
  User, Phone, Mail, Calendar, Ruler, Weight, MapPin, 
  Activity, Camera, Loader2, Check, AlertCircle, Globe, Droplet
} from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';
import { Avatar } from './Avatar';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

interface ProfileDetailsProps {
  userProfile?: any;
  onUpdate?: () => void;
}

interface FormData {
  name: string;
  surname: string;
  email: string;
  imageUrl: string;
  phone: string;
  birthDate: string;
  gender: string;
  weight: string;
  height: string;
  address: string;
  city: string;
  country: string;
  bloodType: string;
  allergies: string;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({ userProfile, onUpdate }) => {
  const { user, session, loading: authLoading, refreshSession, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    surname: '',
    email: '',
    imageUrl: '',
    phone: '',
    birthDate: '',
    gender: '',
    weight: '',
    height: '',
    address: '',
    city: '',
    country: '',
    bloodType: '',
    allergies: '',
  });

  const initialDataRef = useRef<FormData | null>(null);
  const lastProfileId = useRef<string | null>(null);

  const fetchProfileData = async () => {
    if (!user) return;
    
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('Profile')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('[ProfileDetails] Error fetching Profile:', profileError);
        return;
      }

      let patientData: any = null;
      const { data: patient, error: patientError } = await supabase
        .from('Patient')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (!patientError && patient) {
        patientData = patient;
      }
      
      const newFormData: FormData = {
        name: profileData?.name || '',
        surname: profileData?.surname || '',
        email: profileData?.email || '',
        imageUrl: profileData?.image_url || '',
        phone: patientData?.phone || '',
        birthDate: patientData?.birthDate ? new Date(patientData.birthDate).toISOString().split('T')[0] : '',
        gender: patientData?.gender || '',
        weight: patientData?.weight?.toString() || '',
        height: patientData?.height?.toString() || '',
        address: patientData?.address || '',
        city: patientData?.city || '',
        country: patientData?.country || '',
        bloodType: patientData?.bloodType || '',
        allergies: patientData?.allergies || '',
      };

      setFormData(newFormData);
      initialDataRef.current = { ...newFormData };
      lastProfileId.current = profileData?.id;
    } catch (err) {
      console.error('[ProfileDetails] Error in fetchProfileData:', err);
    }
  };

  useEffect(() => {
    if (!userProfile && user && !initialDataRef.current && !loading) {
       fetchProfileData();
    }
  }, [user, userProfile]);

  useEffect(() => {
    if (userProfile && lastProfileId.current !== userProfile.id) {
      const patientData = userProfile.patient || {};
      
      const newFormData: FormData = {
        name: userProfile.name || '',
        surname: userProfile.surname || '',
        email: userProfile.email || '',
        imageUrl: userProfile.image_url || '',
        phone: patientData?.phone || '',
        birthDate: patientData?.birthDate ? new Date(patientData.birthDate).toISOString().split('T')[0] : '',
        gender: patientData?.gender || '',
        weight: patientData?.weight?.toString() || '',
        height: patientData?.height?.toString() || '',
        address: patientData?.address || '',
        city: patientData?.city || '',
        country: patientData?.country || '',
        bloodType: patientData?.bloodType || '',
        allergies: patientData?.allergies || '',
      };

      setFormData(newFormData);
      initialDataRef.current = { ...newFormData };
      lastProfileId.current = userProfile.id;
    }
  }, [userProfile]);

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <h3 className="text-lg font-bold text-secondary">Cargando perfil...</h3>
        <p className="text-gray-500 text-sm mt-2">Estamos recoverando tus datos de forma segura.</p>
      </div>
    );
  }

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-red-50 rounded-3xl border border-red-100 animate-in fade-in zoom-in duration-300">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <h3 className="text-xl font-bold text-red-700">Sesión no detectada</h3>
        <p className="text-red-600/70 text-sm mt-2 mb-6 max-w-xs">
          Para garantizar la seguridad de tus datos médicos, necesitamos que estés autenticado.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button label="Reiniciar Sesión" onClick={refreshSession} variant="primary" fullWidth />
          <Button label="Ir al Login" onClick={signOut} variant="outline" fullWidth />
        </div>
      </div>
    );
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Solo se permiten imágenes' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'La imagen no debe superar los 5MB' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `profile.${fileExt}`;
      const filePath = `avatars/${user.id}/${fileName}`;
      const bucketName = 'profiles';

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase
        .from('Profile')
        .update({ 
          image_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (dbError) throw dbError;

      setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
      if (initialDataRef.current) {
        initialDataRef.current.imageUrl = publicUrl;
      }
      
      await refreshProfile();
      if (onUpdate) onUpdate();
      setMessage({ type: 'success', text: 'Foto actualizada correctamente' });

    } catch (err: any) {
      console.error('[PROFILE_IMG_FAIL]', err);
      setMessage({ type: 'error', text: err.message || 'Error en la subida' });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!initialDataRef.current) {
      setMessage({ type: 'error', text: 'Error: Datos iniciales no cargados. Recarga la página.' });
      setLoading(false);
      return;
    }

    const initial = initialDataRef.current;
    
    const profileFieldsToCheck = ['name', 'surname'];
    const patientFieldsToCheck = ['phone', 'birthDate', 'gender', 'weight', 'height', 'address', 'city', 'country', 'bloodType', 'allergies'];
    
    const profileUpdates: any = {};
    profileFieldsToCheck.forEach(field => {
      const key = field as keyof FormData;
      if (formData[key] !== initial[key]) {
        profileUpdates[field] = formData[key] || null;
      }
    });

    const patientUpdates: any = {};
    patientFieldsToCheck.forEach(field => {
      const key = field as keyof FormData;
      if (formData[key] !== initial[key]) {
        let dbField = field;
        // The columns are birthDate and bloodType (as seen in Prisma/Postgres)
        
        if (field === 'weight' || field === 'height') {
          patientUpdates[dbField] = formData[key] ? parseFloat(formData[key]) : null;
        } else {
          patientUpdates[dbField] = formData[key] || null;
        }
      }
    });

    console.log('[ProfileDetails] Enviando a Profile:', profileUpdates);
    console.log('[ProfileDetails] Enviando a Patient:', patientUpdates);

    try {
      let profileUpdated = false;
      let patientUpdated = false;

      if (Object.keys(profileUpdates).length > 0) {
        const { error: profileError } = await supabase
          .from('Profile')
          .update(profileUpdates)
          .eq('id', user.id);
        
        if (profileError) {
          console.error('[ProfileDetails] Profile update error:', profileError);
          throw new Error(`Error al actualizar perfil: ${profileError.message}`);
        }
        profileUpdated = true;
      }

      if (Object.keys(patientUpdates).length > 0) {
        // En lugar de update directo, intentamos verificar si existe o usamos rpc/upsert
        // Pero como estamos con supabase-js, intentamos update y vemos si falló por no existir
        const { data: existingPatient } = await supabase
          .from('Patient')
          .select('id')
          .eq('profile_id', user.id)
          .single();

        if (existingPatient) {
          const { error: patientError } = await supabase
            .from('Patient')
            .update(patientUpdates)
            .eq('profile_id', user.id);
          
          if (patientError) {
            console.error('[ProfileDetails] Patient update error:', patientError);
            throw new Error(`Error al actualizar datos médicos: ${patientError.message}`);
          }
          patientUpdated = true;
        } else {
          console.log('[ProfileDetails] Patient record not found, creating...');
          const { error: insertError } = await supabase
            .from('Patient')
            .insert({ ...patientUpdates, profile_id: user.id });
          
          if (insertError) {
            console.error('[ProfileDetails] Patient insert error:', insertError);
            throw new Error(`Error al crear datos médicos: ${insertError.message}`);
          }
          patientUpdated = true;
        }
      }

      if (!profileUpdated && !patientUpdated) {
        setMessage({ type: 'success', text: 'No hay cambios para guardar.' });
        setLoading(false);
        return;
      }

      console.log('[ProfileDetails] Guardado exitoso, recargando datos...');
      
      await fetchProfileData();
      await refreshProfile();
      if (onUpdate) onUpdate();
      
      setMessage({ type: 'success', text: 'Perfil actualizado correctamente' });
      
    } catch (err: any) {
      console.error('[ProfileDetails] Error guardando:', err);
      setMessage({ type: 'error', text: err.message || 'Error al guardar cambios. Verifica tu conexión.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-4 py-2">
        <div className="relative group cursor-pointer" onClick={handleImageClick}>
           <Avatar src={formData.imageUrl} alt={formData.name} size="xl" />
           <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploading ? <Loader2 className="text-white animate-spin" /> : <Camera className="text-white" />}
           </div>
           <button 
            className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full border-2 border-white shadow-lg active:scale-90 transition-transform"
            type="button"
           >
             <Camera size={14} />
           </button>
        </div>
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
        />
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Toca para cambiar foto</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-1 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <User size={14} /> Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input 
                 label="Nombre" 
                 name="name"
                 value={formData.name} 
                 onChange={handleChange}
                 icon={<User size={18} />} 
                 required
               />
               <Input 
                 label="Apellido" 
                 name="surname"
                 value={formData.surname} 
                 onChange={handleChange}
                 icon={<User size={18} />}
               />
            </div>
            
            <Input 
                label="Correo Electrónico (Principal)" 
                value={formData.email} 
                readOnly
                className="bg-gray-50 text-gray-400"
                icon={<Mail size={18} />} 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    label="Fecha de Nacimiento" 
                    name="birthDate"
                    type="date" 
                    value={formData.birthDate} 
                    onChange={handleChange}
                    icon={<Calendar size={18} />} 
                />
                <Input 
                    label="Edad (Calculada)" 
                    value={formData.birthDate ? `${Math.abs(new Date(Date.now() - new Date(formData.birthDate).getTime()).getUTCFullYear() - 1970)} años` : '--'} 
                    readOnly
                    className="bg-gray-50 text-gray-400"
                    icon={<Activity size={18} />} 
                />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-text mb-2 px-1">Género</label>
              <select 
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl border-none bg-gray-bg text-text-main shadow-neo-elevated focus:shadow-neo-sunken focus:outline-none transition-all duration-300 text-sm appearance-none"
              >
                <option value="">Selecciona...</option>
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">Otro/Prefiero no decir</option>
              </select>
            </div>

            <Input 
                label="Teléfono de Contacto" 
                name="phone"
                value={formData.phone} 
                onChange={handleChange}
                icon={<Phone size={18} />} 
            />
        </div>

        <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <Activity size={14} /> Datos Clínicos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Altura (cm)" 
                name="height"
                type="number"
                value={formData.height} 
                onChange={handleChange}
                icon={<Ruler size={18} />} 
              />
              <Input 
                label="Peso (kg)" 
                name="weight"
                type="number"
                value={formData.weight} 
                onChange={handleChange}
                icon={<Weight size={18} />} 
              />
            </div>
            
            <div className="space-y-4">
              <div>
                  <label className="block text-sm font-bold text-gray-text mb-2 px-1">Grupo Sanguíneo</label>
                  <select 
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full px-5 py-4 rounded-2xl border-none bg-gray-bg text-text-main shadow-neo-elevated focus:shadow-neo-sunken focus:outline-none transition-all duration-300 text-sm appearance-none"
                  >
                    <option value="">--</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
              </div>
              <Input 
                  label="Alergias / Condiciones" 
                  name="allergies"
                  value={formData.allergies} 
                  onChange={handleChange}
                  placeholder="Ej. Penicilina, Asma..."
                  icon={<Droplet size={18} />} 
              />
            </div>
        </div>

        <div className="space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                <MapPin size={14} /> Ubicación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                    label="Ciudad" 
                    name="city"
                    value={formData.city} 
                    onChange={handleChange}
                    icon={<MapPin size={18} />} 
                />
                <Input 
                    label="País" 
                    name="country"
                    value={formData.country} 
                    onChange={handleChange}
                    icon={<Globe size={18} />} 
                />
            </div>
            <Input 
                label="Dirección Detallada" 
                name="address"
                value={formData.address} 
                onChange={handleChange}
                placeholder="Calle, Edificio..."
            />
        </div>

        <div className="pt-4 sticky bottom-0 bg-white/80 backdrop-blur-md py-4 border-t border-gray-100 flex gap-3">
          <Button 
            label={loading ? "Guardando..." : "Guardar Cambios"} 
            fullWidth 
            variant="primary" 
            type="submit"
            disabled={loading || uploading}
            icon={loading ? Loader2 : Check}
          />
        </div>
      </form>
    </div>
  );
};
