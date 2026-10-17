import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Appointment, Notification, Transaction, QueueEntry, AppointmentStatus } from '../types';
import {
  DEMO_USERS, DEMO_APPOINTMENTS, DEMO_NOTIFICATIONS,
  DEMO_TRANSACTIONS, DEMO_QUEUE, DEMO_CREDENTIALS
} from '../data/demoData';
import { format } from 'date-fns';

interface AppState {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  authError: string | null;

  // Data
  appointments: Appointment[];
  notifications: Notification[];
  transactions: Transaction[];
  queue: QueueEntry[];

  // UI
  isLoading: boolean;

  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  clearAuthError: () => void;

  submitAppointment: (data: Omit<Appointment, 'id' | 'reference' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => Appointment;
  updateAppointmentStatus: (id: string, status: AppointmentStatus, note?: string, changedBy?: string) => void;
  cancelAppointment: (id: string, reason?: string) => void;

  getPatientAppointments: (patientId: string) => Appointment[];
  getHospitalAppointments: (hospitalId: string) => Appointment[];

  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (userId: string) => void;
  addNotification: (notif: Omit<Notification, 'id' | 'createdAt'>) => void;

  getUnreadCount: (userId: string) => number;
}

let appointmentCounter = 5;
let notificationCounter = 10;

function generateRef(): string {
  const d = format(new Date(), 'yyMM');
  const n = String(appointmentCounter).padStart(4, '0');
  return `MS360-${d}-${n}`;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      authError: null,
      appointments: DEMO_APPOINTMENTS,
      notifications: DEMO_NOTIFICATIONS,
      transactions: DEMO_TRANSACTIONS,
      queue: DEMO_QUEUE,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true, authError: null });
        await new Promise(r => setTimeout(r, 800)); // simulate network

        const expectedCred = DEMO_CREDENTIALS[email];
        if (!expectedCred || expectedCred.password !== password) {
          // Also allow registered users
          const allUsers = [...DEMO_USERS, ...((get() as any)._registeredUsers || [])];
          const regUser = allUsers.find(u => u.email === email);
          const regCreds = (get() as any)._registeredCreds || {};
          if (!regUser || regCreds[email] !== password) {
            set({ authError: 'Invalid email or password. Use credentials or register.', isLoading: false });
            return false;
          }
          set({ currentUser: regUser, isAuthenticated: true, isLoading: false });
          return true;
        }

        const user = DEMO_USERS.find(u => u.id === expectedCred.userId || u.email === email);
        if (!user) {
          set({ authError: 'User not found.', isLoading: false });
          return false;
        }

        set({ currentUser: user, isAuthenticated: true, isLoading: false });
        return true;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },

      register: async (name, email, phone, password) => {
        set({ isLoading: true, authError: null });
        await new Promise(r => setTimeout(r, 800));

        const allUsers = [...DEMO_USERS, ...((get() as any)._registeredUsers || [])];
        if (allUsers.find(u => u.email === email)) {
          set({ authError: 'An account with this email already exists.', isLoading: false });
          return false;
        }

        const newUser: User = {
          id: `u-${Date.now()}`,
          name,
          email,
          phone,
          role: 'patient',
          avatarInitials: name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
          createdAt: new Date().toISOString(),
        };

        set((state: any) => ({
          _registeredUsers: [...(state._registeredUsers || []), newUser],
          _registeredCreds: { ...(state._registeredCreds || {}), [email]: password },
          currentUser: newUser,
          isAuthenticated: true,
          isLoading: false,
        }));
        return true;
      },

      clearAuthError: () => set({ authError: null }),

      submitAppointment: (data) => {
        appointmentCounter++;
        const newAppt: Appointment = {
          ...data,
          id: `apt-${Date.now()}`,
          reference: generateRef(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          statusHistory: [
            {
              status: 'pending',
              changedAt: new Date().toISOString(),
              changedBy: data.patientName,
              note: 'Appointment request submitted via MEDI SEVA 360',
            }
          ],
        };

        set(state => ({ appointments: [newAppt, ...state.appointments] }));

        // Add notification for patient
        get().addNotification({
          userId: data.patientId,
          type: 'appointment_submitted',
          title: 'Appointment Request Submitted',
          message: `Your request to ${data.hospitalName} (${data.specialty}) for ${data.preferredDate} has been received. Reference: ${newAppt.reference}.`,
          read: false,
          appointmentId: newAppt.id,
          actionUrl: '/patient/appointments',
        });

        // Notify receptionist (u002 manages h001, others get notif too for demo)
        get().addNotification({
          userId: 'u002',
          type: 'appointment_submitted',
          title: 'New Appointment Request',
          message: `${data.patientName} requested an appointment for ${data.specialty} on ${data.preferredDate}.`,
          read: false,
          appointmentId: newAppt.id,
          actionUrl: '/receptionist/appointments',
        });

        return newAppt;
      },

      updateAppointmentStatus: (id, status, note, changedBy) => {
        const user = get().currentUser;
        const actor = changedBy || user?.name || 'System';

        set(state => ({
          appointments: state.appointments.map(a => {
            if (a.id !== id) return a;
            const histEntry = {
              status,
              changedAt: new Date().toISOString(),
              changedBy: actor,
              note: note || `Status updated to ${status}`,
            };
            return {
              ...a,
              status,
              updatedAt: new Date().toISOString(),
              queueNumber: status === 'accepted' ? (a.queueNumber || Math.floor(Math.random() * 20) + 1) : a.queueNumber,
              statusHistory: [...a.statusHistory, histEntry],
            };
          }),
        }));

        // Generate notification for patient
        const appt = get().appointments.find(a => a.id === id);
        if (!appt) return;

        const notifMap: Partial<Record<AppointmentStatus, { type: Notification['type']; title: string; msg: string }>> = {
          accepted: {
            type: 'appointment_accepted',
            title: 'Appointment Accepted',
            msg: `Your appointment at ${appt.hospitalName} (${appt.specialty}) on ${appt.preferredDate} has been accepted.`,
          },
          rejected: {
            type: 'appointment_rejected',
            title: 'Appointment Not Accepted',
            msg: `Your appointment request at ${appt.hospitalName} was not accepted. Reason: ${note || 'No reason provided'}.`,
          },
          cancelled: {
            type: 'appointment_cancelled',
            title: 'Appointment Cancelled',
            msg: `Your appointment at ${appt.hospitalName} has been cancelled.`,
          },
          completed: {
            type: 'appointment_submitted',
            title: 'Appointment Completed',
            msg: `Your appointment at ${appt.hospitalName} has been marked as completed.`,
          },
        };

        const n = notifMap[status];
        if (n) {
          get().addNotification({
            userId: appt.patientId,
            type: n.type,
            title: n.title,
            message: n.msg,
            read: false,
            appointmentId: id,
            actionUrl: '/patient/appointments',
          });
        }
      },

      cancelAppointment: (id, reason) => {
        get().updateAppointmentStatus(id, 'cancelled', reason || 'Cancelled by patient');
      },

      getPatientAppointments: (patientId) => {
        return get().appointments.filter(a => a.patientId === patientId);
      },

      getHospitalAppointments: (hospitalId) => {
        return get().appointments.filter(a => a.hospitalId === hospitalId);
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },

      markAllNotificationsRead: (userId) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.userId === userId ? { ...n, read: true } : n
          ),
        }));
      },

      addNotification: (notif) => {
        notificationCounter++;
        const newNotif: Notification = {
          ...notif,
          id: `n-${Date.now()}-${notificationCounter}`,
          createdAt: new Date().toISOString(),
        };
        set(state => ({ notifications: [newNotif, ...state.notifications] }));
      },

      getUnreadCount: (userId) => {
        return get().notifications.filter(n => n.userId === userId && !n.read).length;
      },
    }),
    {
      name: 'mediseva-demo-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
        appointments: state.appointments,
        notifications: state.notifications,
        transactions: state.transactions,
        queue: state.queue,
      }),
    }
  )
);
