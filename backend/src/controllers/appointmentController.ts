import { Request, Response } from 'express';
import prisma from '../utils/prisma.js';

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    type: string;
  };
}

export const getDoctorAvailability = async (req: Request, res: Response) => {
  const { doctorId } = req.params;
  const { start, end } = req.query;

  try {
    const doctor = await (prisma.doctor as any).findUnique({
      where: { id: doctorId },
      include: { 
        availability: true,
        profile: true
      }
    });

    if (!doctor) {
      return res.status(404).json({ success: false, error: 'Médico no encontrado' });
    }

    // Fetch existing appointments in range to avoid double booking
    const appointments = await (prisma as any).appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: start ? new Date(start as string) : undefined,
          lte: end ? new Date(end as string) : undefined
        },
        status: { not: 'cancelled' }
      }
    });

    res.json({
      success: true,
      data: {
        doctor,
        appointments
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createAppointment = async (req: AuthRequest, res: Response) => {
  const { doctorId, date, type, price, notes } = req.body;
  const userId = req.user?.id;

  console.log('[BACKEND_BOOKING] Recibida solicitud de agendamiento:', { userId, doctorId, date });

  if (!userId) return res.status(401).json({ success: false, error: 'No autorizado - Sesión no encontrada' });

  try {
    // 1. Get Patient ID from Profile
    const patient = await (prisma as any).patient.findUnique({
      where: { profileId: userId }
    });

    if (!patient) {
      console.error('[BACKEND_BOOKING] Fallo: Perfil de paciente no vinculado al usuario:', userId);
      return res.status(400).json({ success: false, error: 'Su perfil de usuario no tiene un registro de Paciente vinculado.' });
    }

    // 2. Check for conflict (double booking)
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ success: false, error: 'Fecha de cita inválida' });
    }

    const existing = await (prisma as any).appointment.findFirst({
      where: {
        doctorId,
        date: appointmentDate,
        status: { not: 'cancelled' }
      }
    });

    if (existing) {
      return res.status(400).json({ success: false, error: 'Este horario ya no está disponible (Ya reservado por otro paciente)' });
    }

    // 3. Create appointment
    const appointment = await (prisma as any).appointment.create({
      data: {
        doctorId,
        patientId: patient.id,
        date: appointmentDate,
        type: type || 'Consulta General',
        price: price ? parseFloat(price.toString()) : 0,
        notes: notes || '',
        status: 'upcoming'
      }
    });

    console.log('[BACKEND_BOOKING] Cita creada con éxito:', appointment.id);
    res.json({ success: true, data: appointment });
  } catch (error: any) {
    console.error('[BACKEND_BOOKING_CRITICAL_ERROR]', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error interno del servidor al procesar la cita',
      message: error.message,
      detail: error.code // Prisma error code if available
    });
  }
};
