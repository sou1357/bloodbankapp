import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Droplets, Package, AlertCircle, Plus, Edit2, CheckCircle, XCircle, Send, Building } from 'lucide-react';

export default function BloodBankDashboard() {
  const [activeTab, setActiveTab] = useState('inventory');
  const [inventory, setInventory] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    blood_group: 'A+',
    quantity: 0,
    status: 'AVAILABLE'
  });

  useEffect(() => {
    fetchInventory();
    fetchRequests();
  }, []);

  const fetchInventory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/inventory', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setInventory(data);
        if (data.length === 0) {
          await initializeInventory();
        }
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeInventory = async () => {
    const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const token = localStorage.getItem('token');

    for (const group of bloodGroups) {
      try {
        await fetch('/api/inventory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            blood_group: group,
            quantity: Math.floor(Math.random() * 50) + 10,
            status: 'AVAILABLE'
          })
        });
      } catch (error) {
        console.error(`Error initializing ${group}:`, error);
      }
    }

    fetchInventory();
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/blood-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setRequests(data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const handleUpdateInventory = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/inventory/${editingItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          quantity: formData.quantity,
          status: formData.status
        })
      });

      if (response.ok) {
        setEditingItem(null);
        fetchInventory();
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blood-requests/${requestId}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blood-requests/${requestId}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchRequests();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  const handleIssue = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blood-requests/${requestId}/issue`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchRequests();
        fetchInventory();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to issue blood');
      }
    } catch (error) {
      console.error('Error issuing blood:', error);
      alert('Failed to issue blood');
    }
  };

  const getStatusColor = (quantity) => {
    if (quantity >= 30) return 'bg-green-100 text-green-800 border-green-200';
    if (quantity >= 15) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (quantity >= 5) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-red-100 text-red-800 border-red-200';
  };

  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockCount = inventory.filter(item => item.quantity < 15).length;

  return (
    <DashboardLayout title="Blood Bank Dashboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Blood Bank Management</h2>
          <p className="text-gray-600">Manage inventory and fulfill hospital requests</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={<Droplets className="w-6 h-6 text-red-600" />}
            title="Total Units"
            value={totalUnits}
            bgColor="bg-red-50"
          />
          <StatCard
            icon={<Package className="w-6 h-6 text-blue-600" />}
            title="Blood Types"
            value={inventory.length}
            bgColor="bg-blue-50"
          />
          <StatCard
            icon={<AlertCircle className="w-6 h-6 text-orange-600" />}
            title="Low Stock"
            value={lowStockCount}
            bgColor="bg-orange-50"
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('inventory')}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === 'inventory'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Inventory
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`flex-1 py-4 px-6 font-medium transition-colors ${
                  activeTab === 'requests'
                    ? 'text-red-600 border-b-2 border-red-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Requests
                {requests.filter(r => r.status === 'PENDING').length > 0 && (
                  <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                    {requests.filter(r => r.status === 'PENDING').length}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'inventory' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  <>
                    {editingItem && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Update {editingItem.blood_group} Inventory
                        </h4>
                        <form onSubmit={handleUpdateInventory} className="flex gap-3">
                          <input
                            type="number"
                            min="0"
                            required
                            value={formData.quantity}
                            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Quantity"
                          />
                          <button
                            type="submit"
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingItem(null)}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            Cancel
                          </button>
                        </form>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {inventory.map((item) => (
                        <div
                          key={item.id}
                          className={`border rounded-lg p-4 ${getStatusColor(item.quantity)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold">{item.blood_group}</span>
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setFormData({ ...formData, quantity: item.quantity });
                              }}
                              className="p-1 hover:bg-white/50 rounded transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-lg font-semibold">{item.quantity} units</p>
                          <p className="text-xs mt-1">
                            {item.quantity >= 30 ? 'Good Stock' :
                             item.quantity >= 15 ? 'Medium Stock' :
                             item.quantity >= 5 ? 'Low Stock' : 'Critical'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {activeTab === 'requests' && (
              <div>
                {requests.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Building className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p>No requests yet</p>
                    <p className="text-sm mt-1">Hospital requests will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-gray-900">{request.patient_name}</h4>
                              <StatusBadge status={request.status} />
                              {request.urgency === 'EMERGENCY' && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                                  EMERGENCY
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>Hospital: {request.hospital?.name}</p>
                              <p>Blood Group: <span className="font-semibold text-red-600">{request.blood_group}</span></p>
                              <p>Units Needed: <span className="font-semibold">{request.units_needed}</span></p>
                              <p>Requested: {new Date(request.createdAt).toLocaleString()}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {request.status === 'PENDING' && (
                              <>
                                <button
                                  onClick={() => handleApprove(request.id)}
                                  className="flex items-center gap-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReject(request.id)}
                                  className="flex items-center gap-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject
                                </button>
                              </>
                            )}
                            {request.status === 'APPROVED' && (
                              <button
                                onClick={() => handleIssue(request.id)}
                                className="flex items-center gap-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                              >
                                <Send className="w-4 h-4" />
                                Issue Blood
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
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

function StatusBadge({ status }) {
  const styles = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-green-100 text-green-700',
    REJECTED: 'bg-red-100 text-red-700',
    ISSUED: 'bg-blue-100 text-blue-700'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
