import { useAppStore } from '../../store/appStore';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import type { QueueEntry } from '../../types';

const HOSPITAL_ID = 'h001';

const STATUS_STYLES: Record<QueueEntry['status'], string> = {
  waiting: 'bg-amber-50 border-amber-200',
  'in-consultation': 'bg-blue-50 border-blue-200',
  completed: 'bg-gray-50 border-gray-200',
  skipped: 'bg-red-50 border-red-200',
};

const BADGE_STYLES: Record<QueueEntry['status'], string> = {
  waiting: 'bg-amber-500 text-white',
  'in-consultation': 'bg-blue-600 text-white',
  completed: 'bg-gray-400 text-white',
  skipped: 'bg-red-500 text-white',
};

function ReceptionistQueueContent() {
  const { queue } = useAppStore();
  const todayQueue = queue.filter(q => q.hospitalId === HOSPITAL_ID);

  const waiting = todayQueue.filter(q => q.status === 'waiting');
  const inConsultation = todayQueue.filter(q => q.status === 'in-consultation');
  const completed = todayQueue.filter(q => q.status === 'completed');

  const sidebarItems = [
    { label: 'Overview', icon: 'LayoutDashboard' as const, href: '/receptionist/dashboard', active: false },
    { label: 'Appointment Requests', icon: 'ClipboardList' as const, href: '/receptionist/appointments', active: false },
    { label: "Today's Queue", icon: 'ListOrdered' as const, href: '/receptionist/queue', active: true },
    { label: 'Notifications', icon: 'Bell' as const, href: '/receptionist/notifications', active: false },
    { label: 'Hospital Profile', icon: 'Building2' as const, href: '/receptionist/hospital', active: false },
  ];

  const QueueCard = ({ entry }: { entry: QueueEntry }) => (
    <div className={`p-4 rounded-xl border ${STATUS_STYLES[entry.status]} transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${BADGE_STYLES[entry.status]}`}>
          {entry.queueNumber}
        </span>
        <span className="text-xs capitalize text-medical-muted">{entry.scheduledTime}</span>
      </div>
      <p className="text-sm font-semibold text-medical-text">{entry.patientName}</p>
      <p className="text-xs text-medical-muted">{entry.specialty}</p>
      <p className="text-xs text-amber-600 mt-1">Demo — not real patient</p>
    </div>
  );

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Today's Queue">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy-DEFAULT font-display">Queue Management</h2>
        <p className="text-medical-muted text-sm mt-1">{todayQueue.length} entries today — demo data</p>
      </div>

      <div className="demo-banner mb-6">
        🧪 Queue shown is fictional demo data. Real-time queue integration with a hospital system is not active.
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Waiting', count: waiting.length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'In Consultation', count: inConsultation.length, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Completed', count: completed.length, color: 'text-gray-600', bg: 'bg-gray-50' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
            <div className="text-xs text-medical-muted mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Kanban columns */}
      <div className="grid md:grid-cols-3 gap-6">
        <div>
          <h3 className="font-semibold text-amber-600 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            Waiting ({waiting.length})
          </h3>
          <div className="space-y-3">
            {waiting.length === 0 ? (
              <p className="text-sm text-medical-muted text-center py-6 bg-white rounded-xl border border-gray-100">No patients waiting</p>
            ) : waiting.map(q => <QueueCard key={q.id} entry={q} />)}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            In Consultation ({inConsultation.length})
          </h3>
          <div className="space-y-3">
            {inConsultation.length === 0 ? (
              <p className="text-sm text-medical-muted text-center py-6 bg-white rounded-xl border border-gray-100">No active consultations</p>
            ) : inConsultation.map(q => <QueueCard key={q.id} entry={q} />)}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-gray-500 mb-3 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-400" />
            Completed ({completed.length})
          </h3>
          <div className="space-y-3">
            {completed.length === 0 ? (
              <p className="text-sm text-medical-muted text-center py-6 bg-white rounded-xl border border-gray-100">No completed yet</p>
            ) : completed.map(q => <QueueCard key={q.id} entry={q} />)}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function ReceptionistQueue() {
  return (
    <ProtectedRoute requiredRole="receptionist">
      <ReceptionistQueueContent />
    </ProtectedRoute>
  );
}
