import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { Heart, Calendar, Award, MapPin } from 'lucide-react';

export default function DonorDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout title="Donor Dashboard">
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg p-8 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Welcome, {user?.name}!</h2>
              <p className="text-red-100">Thank you for being a life-saver</p>
            </div>
          </div>
          <div className="flex items-center gap-6 mt-6">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm text-red-100">Blood Type</p>
              <p className="text-2xl font-bold">{user?.blood_group}</p>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm text-red-100">Status</p>
              <p className="text-lg font-semibold">Eligible</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Calendar className="w-6 h-6 text-blue-600" />}
            title="Total Donations"
            value="0"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-yellow-600" />}
            title="Lives Saved"
            value="0"
            bgColor="bg-yellow-50"
          />
          <StatCard
            icon={<Heart className="w-6 h-6 text-red-600" />}
            title="Next Eligible"
            value="Now"
            bgColor="bg-red-50"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Nearby Blood Drives</h3>
          <div className="text-center py-12 text-gray-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No blood drives near you right now</p>
            <p className="text-sm mt-1">Check back later for opportunities to donate</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation History</h3>
          <div className="text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No donations yet</p>
            <p className="text-sm mt-1">Your donation history will appear here</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ icon, title, value, bgColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className={`${bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
