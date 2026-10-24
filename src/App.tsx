import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ToastContainer from './components/ui/ToastContainer';
import PushNotificationPrompt from './components/ui/PushNotificationPrompt';
import { initInstallTracker } from './utils/installTracker';

// Initialize install & visit tracking
initInstallTracker();

// Public pages
import HomePage from './pages/HomePage';
import HospitalsPage from './pages/HospitalsPage';
import HospitalDetailPage from './pages/HospitalDetailPage';
import HospitalsMapPage from './pages/HospitalsMapPage';
import AppointmentBookingPage from './pages/AppointmentBookingPage';
import AmbulancePage from './pages/AmbulancePage';
import ConsultationPage from './pages/ConsultationPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Patient pages
import PatientDashboard from './pages/patient/PatientDashboard';
import PatientAppointments from './pages/patient/PatientAppointments';
import PatientNotifications from './pages/patient/PatientNotifications';
import PatientTransactions from './pages/patient/PatientTransactions';
import PatientProfile from './pages/patient/PatientProfile';

// Receptionist pages
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import ReceptionistAppointments from './pages/receptionist/ReceptionistAppointments';
import ReceptionistQueue from './pages/receptionist/ReceptionistQueue';
import ReceptionistNotifications from './pages/receptionist/ReceptionistNotifications';
import ReceptionistHospital from './pages/receptionist/ReceptionistHospital';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminHospitals from './pages/admin/AdminHospitals';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAppointments from './pages/admin/AdminAppointments';
import AdminReports from './pages/admin/AdminReports';
import AdminNotifications from './pages/admin/AdminNotifications';

// 404
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/hospitals/map" element={<HospitalsMapPage />} />
        <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
        <Route path="/book-appointment" element={<AppointmentBookingPage />} />
        <Route path="/ambulance" element={<AmbulancePage />} />
        <Route path="/consult" element={<ConsultationPage />} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/appointments" element={<PatientAppointments />} />
        <Route path="/patient/notifications" element={<PatientNotifications />} />
        <Route path="/patient/transactions" element={<PatientTransactions />} />
        <Route path="/patient/profile" element={<PatientProfile />} />

        {/* Receptionist */}
        <Route path="/receptionist/dashboard" element={<ReceptionistDashboard />} />
        <Route path="/receptionist/appointments" element={<ReceptionistAppointments />} />
        <Route path="/receptionist/queue" element={<ReceptionistQueue />} />
        <Route path="/receptionist/notifications" element={<ReceptionistNotifications />} />
        <Route path="/receptionist/hospital" element={<ReceptionistHospital />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/hospitals" element={<AdminHospitals />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/notifications" element={<AdminNotifications />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        {/* Fallback */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <ToastContainer />
      <PushNotificationPrompt />
    </BrowserRouter>
  );
}

export default App;
