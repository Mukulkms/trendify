import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardOverview from './components/DashboardOverview';
import { useAuth2 } from '../super-admin/AuthContext2';

export default function Dashboard() {
  const { user, loading } = useAuth2();
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

 
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <div className="flex flex-1">
        <main className="flex-1 overflow-y-auto">
          <DashboardOverview />
        </main>
      </div>
    </div>
  );
}