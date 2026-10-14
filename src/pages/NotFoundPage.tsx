import { Link } from 'react-router-dom';
import { Home, Heart } from 'lucide-react';
import PageLayout from '../components/layout/PageLayout';

export default function NotFoundPage() {
  return (
    <PageLayout>
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 rounded-3xl bg-primary-50 flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-primary-200" />
        </div>
        <h1 className="text-6xl font-bold text-primary-200 font-display mb-4">404</h1>
        <h2 className="text-2xl font-bold text-navy-DEFAULT font-display mb-3">Page Not Found</h2>
        <p className="text-medical-muted mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/hospitals" className="btn-secondary">Find Hospitals</Link>
        </div>
      </div>
    </PageLayout>
  );
}
