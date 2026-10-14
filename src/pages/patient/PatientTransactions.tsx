import { useState } from 'react';
import { X, Printer, AlertCircle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { useAppStore } from '../../store/appStore';
import { formatCurrency, formatDate } from '../../utils/helpers';
import type { Transaction } from '../../types';

const STATUS_STYLES: Record<Transaction['status'], string> = {
  pending: 'badge-yellow',
  successful: 'badge-green',
  failed: 'badge-red',
  refunded: 'badge-gray',
};

function PatientTransactionsContent() {
  const { currentUser, transactions } = useAppStore();
  const [receiptTxn, setReceiptTxn] = useState<Transaction | null>(null);

  const myTxns = transactions.filter(t => t.patientId === currentUser?.id);

  const sidebarItems = [
    { label: 'Dashboard', icon: 'LayoutDashboard' as const, href: '/patient/dashboard', active: false },
    { label: 'Find Hospitals', icon: 'Search' as const, href: '/hospitals', active: false },
    { label: 'My Appointments', icon: 'Calendar' as const, href: '/patient/appointments', active: false },
    { label: 'Notifications', icon: 'Bell' as const, href: '/patient/notifications', active: false },
    { label: 'Transactions', icon: 'CreditCard' as const, href: '/patient/transactions', active: true },
    { label: 'My Profile', icon: 'User' as const, href: '/patient/profile', active: false },
  ];

  return (
    <DashboardLayout sidebarItems={sidebarItems} headerTitle="Transactions">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-navy-DEFAULT font-display">Transaction History</h2>
        <p className="text-medical-muted text-sm mt-1">{myTxns.length} total transactions</p>
      </div>

      <div className="demo-banner mb-6">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span><strong>Demo Transactions</strong> — No real payments have been processed. All amounts and references are fictional.</span>
      </div>

      {myTxns.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-medical-muted">No transactions found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Reference</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide hidden md:table-cell">Hospital</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide hidden lg:table-cell">Service</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide hidden sm:table-cell">Date</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-medical-muted uppercase tracking-wide">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {myTxns.map(txn => (
                  <tr key={txn.id} className="hover:bg-gray-50/50">
                    <td className="px-5 py-4">
                      <p className="font-mono text-xs text-primary-600 font-semibold">{txn.reference}</p>
                      <p className="text-xs text-medical-muted">{txn.appointmentReference}</p>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell text-xs text-medical-text">{txn.hospitalName.split('–')[0].trim()}</td>
                    <td className="px-5 py-4 hidden lg:table-cell text-xs text-medical-muted max-w-xs truncate">{txn.serviceDescription}</td>
                    <td className="px-5 py-4 font-semibold text-medical-text">{formatCurrency(txn.amount, txn.currency)}</td>
                    <td className="px-5 py-4"><span className={`badge ${STATUS_STYLES[txn.status]}`}>{txn.status.charAt(0).toUpperCase() + txn.status.slice(1)}</span></td>
                    <td className="px-5 py-4 text-xs text-medical-muted hidden sm:table-cell">{formatDate(txn.createdAt)}</td>
                    <td className="px-5 py-4 text-right">
                      {txn.status === 'successful' && (
                        <button onClick={() => setReceiptTxn(txn)} className="btn-secondary text-xs px-3 py-1.5">
                          <Printer className="w-3 h-3" /> Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receiptTxn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setReceiptTxn(null)} />
          <div className="relative bg-white rounded-2xl shadow-modal max-w-sm w-full p-8 animate-slide-up">
            <button onClick={() => setReceiptTxn(null)} className="absolute top-4 right-4 p-2 hover:bg-gray-50 rounded-lg">
              <X className="w-4 h-4 text-medical-muted" />
            </button>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <Printer className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-medical-text font-display">Digital Receipt</h3>
              <p className="text-xs text-amber-600 mt-1">Demo Receipt — Not a real financial document</p>
            </div>
            <div className="space-y-3 text-sm border-t border-dashed border-gray-200 pt-4">
              {[
                ['Receipt No', receiptTxn.reference],
                ['Appointment Ref', receiptTxn.appointmentReference],
                ['Hospital', receiptTxn.hospitalName.split('–')[0].trim()],
                ['Service', receiptTxn.serviceDescription],
                ['Amount', formatCurrency(receiptTxn.amount, receiptTxn.currency)],
                ['Payment Method', receiptTxn.paymentMethod],
                ['Date', formatDate(receiptTxn.createdAt)],
                ['Status', 'Successful (Demo)'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-medical-muted">{k}</span>
                  <span className="font-medium text-medical-text text-right max-w-xs">{v}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed border-gray-200 mt-4 pt-4">
              <p className="text-xs text-center text-medical-muted">MRK SEVA 360 Demo Platform · Not a real receipt</p>
            </div>
            <button onClick={() => window.print()} className="btn-primary w-full mt-4">
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function PatientTransactions() {
  return (
    <ProtectedRoute requiredRole="patient">
      <PatientTransactionsContent />
    </ProtectedRoute>
  );
}
