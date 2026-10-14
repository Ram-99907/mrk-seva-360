import type { ReactNode } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldX, ArrowLeft, Stethoscope } from 'lucide-react';
import { useAppStore } from '../../store/appStore';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAppStore();

  // Not logged in → redirect to login with returnUrl
  if (!isAuthenticated || !currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ returnUrl: location.pathname + location.search }}
        replace
      />
    );
  }

  // Wrong role → show Access Denied
  if (requiredRole && currentUser.role !== requiredRole) {
    const roleHomeMap: Record<UserRole, string> = {
      patient: '/patient/dashboard',
      receptionist: '/receptionist/dashboard',
      admin: '/admin/dashboard',
    };

    const handleBack = () => {
      navigate(roleHomeMap[currentUser.role], { replace: true });
    };

    const handleLogout = () => {
      logout();
      navigate('/login', { replace: true });
    };

    return (
      <div className="min-h-screen bg-[#F5F9FC] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Logo strip */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="bg-[#1769AA] text-white p-2 rounded-xl">
              <Stethoscope size={22} />
            </div>
            <span className="text-xl font-bold text-[#102A43] tracking-tight">
              mrkseva <span className="text-[#1769AA]">360</span>
            </span>
          </div>

          <div className="card p-10">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className="bg-red-100 rounded-full p-5">
                <ShieldX size={40} className="text-red-500" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-[#243746] mb-2">Access Denied</h1>
            <p className="text-[#64748B] text-sm mb-2">
              You don't have permission to view this page.
            </p>
            <p className="text-[#64748B] text-sm mb-8">
              This section requires a{' '}
              <span className="font-semibold text-[#243746] capitalize">{requiredRole}</span>{' '}
              account, but you are signed in as{' '}
              <span className="font-semibold text-[#243746]">{currentUser.name}</span>{' '}
              (
              <span className="capitalize text-[#1769AA] font-medium">{currentUser.role}</span>
              ).
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleBack}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Go to my Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="btn-ghost w-full text-[#64748B]"
              >
                Sign in with a different account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
