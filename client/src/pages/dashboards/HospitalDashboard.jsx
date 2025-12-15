import DashboardLayout from '../../components/layout/DashboardLayout';
import { Activity, Users, Calendar, TrendingUp } from 'lucide-react';

export default function HospitalDashboard() {
  return (
    <DashboardLayout title="Hospital Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Hospital Portal</h2>
          <p className="text-gray-600">Manage blood requests and inventory for your hospital</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<Activity className="w-6 h-6 text-blue-600" />}
            title="Active Requests"
            value="12"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-green-600" />}
            title="Available Donors"
            value="48"
            bgColor="bg-green-50"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6 text-purple-600" />}
            title="Scheduled"
            value="6"
            bgColor="bg-purple-50"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6 text-orange-600" />}
            title="This Month"
            value="23"
            bgColor="bg-orange-50"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Blood Requests</h3>
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No blood requests yet</p>
            <p className="text-sm mt-1">Request blood from blood banks to get started</p>
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
