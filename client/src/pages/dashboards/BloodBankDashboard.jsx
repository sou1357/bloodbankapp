import DashboardLayout from '../../components/layout/DashboardLayout';
import { Droplets, Package, Users, AlertCircle } from 'lucide-react';

export default function BloodBankDashboard() {
  const bloodTypes = [
    { type: 'A+', units: 45, status: 'good' },
    { type: 'A-', units: 12, status: 'low' },
    { type: 'B+', units: 38, status: 'good' },
    { type: 'B-', units: 8, status: 'critical' },
    { type: 'AB+', units: 22, status: 'medium' },
    { type: 'AB-', units: 6, status: 'critical' },
    { type: 'O+', units: 52, status: 'good' },
    { type: 'O-', units: 15, status: 'low' },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <DashboardLayout title="Blood Bank Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blood Bank Inventory</h2>
          <p className="text-gray-600">Manage blood stock and supply to hospitals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Droplets className="w-6 h-6 text-red-600" />}
            title="Total Units"
            value="198"
            bgColor="bg-red-50"
          />
          <StatCard
            icon={<Package className="w-6 h-6 text-blue-600" />}
            title="Blood Types"
            value="8"
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<Users className="w-6 h-6 text-green-600" />}
            title="Registered Donors"
            value="342"
            bgColor="bg-green-50"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Blood Inventory by Type</h3>
            <div className="flex items-center gap-2 text-sm text-orange-600">
              <AlertCircle className="w-4 h-4" />
              <span>3 types need attention</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {bloodTypes.map((blood) => (
              <div
                key={blood.type}
                className={`border rounded-lg p-4 ${getStatusColor(blood.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold">{blood.type}</span>
                  <Droplets className="w-6 h-6" />
                </div>
                <p className="text-lg font-semibold">{blood.units} units</p>
                <p className="text-xs capitalize mt-1">{blood.status}</p>
              </div>
            ))}
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
