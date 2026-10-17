// Types for MEDI SEVA 360

export type UserRole = 'patient' | 'receptionist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  hospitalId?: string; // for receptionists
  avatarInitials?: string;
  createdAt: string;
}

export type HospitalType = 'government' | 'private';
export type HospitalCategory = 'multi-specialty' | 'general' | 'specialty-clinic' | 'teaching' | 'district';

export interface Hospital {
  id: string;
  name: string;
  type: HospitalType;
  category: HospitalCategory;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  phone?: string;
  email?: string;
  website?: string;
  openingHours?: string;
  specialties: string[];
  services: string[];
  departments: string[];
  image?: string;
  coordinates?: { lat: number; lng: number };
  lat?: number;
  lng?: number;
  bookingAvailable: boolean;
  emergencyAvailable: boolean;
  description?: string;
  dataSource: string;
  lastUpdated: string;
  accreditedBy?: string;
  bedCount?: number;
  bedsAvailable?: number;
  icuBeds?: number;
  ambulances?: number;
  established?: number;
  opdTimings?: string;
  opdFee?: 'Free' | number;
  insuranceSchemes?: string[];
  rating?: number;
  reviewCount?: number;
  isHfrVerified?: boolean;
  nhsEmrCode?: string;
}

export type AppointmentStatus = 'draft' | 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  reference: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  hospitalId: string;
  hospitalName: string;
  specialty: string;
  preferredDoctor?: string;
  preferredDate: string;
  preferredTime: string;
  reason?: string;
  status: AppointmentStatus;
  queueNumber?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  statusHistory: StatusHistoryEntry[];
}

export interface StatusHistoryEntry {
  status: AppointmentStatus;
  changedAt: string;
  changedBy: string;
  note?: string;
}

export interface QueueEntry {
  id: string;
  appointmentId: string;
  queueNumber: number;
  patientName: string;
  specialty: string;
  scheduledTime: string;
  status: 'waiting' | 'in-consultation' | 'completed' | 'skipped';
  hospitalId: string;
}

export type NotificationType = 'appointment_submitted' | 'appointment_accepted' | 'appointment_rejected' | 'appointment_cancelled' | 'appointment_reminder' | 'queue_update' | 'system_alert';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  appointmentId?: string;
  actionUrl?: string;
}

export type TransactionStatus = 'pending' | 'successful' | 'failed' | 'refunded';

export interface Transaction {
  id: string;
  reference: string;
  appointmentId: string;
  appointmentReference: string;
  patientId: string;
  patientName: string;
  hospitalId: string;
  hospitalName: string;
  serviceDescription: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: string;
  createdAt: string;
  completedAt?: string;
  isDemo: boolean;
}

export interface Review {
  id: string;
  hospitalId: string;
  patientId: string;
  patientName: string;
  rating: number;
  comment: string;
  createdAt: string;
  moderated: boolean;
  isDemo: boolean;
}
