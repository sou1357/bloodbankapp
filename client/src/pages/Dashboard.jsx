import { useAuth } from '../context/AuthContext';
import HospitalDashboard from './dashboards/HospitalDashboard';
import BloodBankDashboard from './dashboards/BloodBankDashboard';
import DonorDashboard from './dashboards/DonorDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (user.role === 'BLOOD_SERVICE') {
    if (user.organizationType === 'HOSPITAL') {
      return <HospitalDashboard />;
    } else if (user.organizationType === 'BLOOD_BANK') {
      return <BloodBankDashboard />;
    }
  }

  if (user.role === 'DONOR') {
    return <DonorDashboard />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <p>Invalid user role</p>
    </div>
  );
}
