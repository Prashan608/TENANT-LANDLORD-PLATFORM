import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const LandlordDashboard = () => {
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [payments, setPayments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [urgencyFilter, setUrgencyFilter] = useState('All');
  const [user] = useState({ name: 'Landlord' });

  useEffect(() => {
    const storedRequests = JSON.parse(localStorage.getItem('maintenanceRequests') || '[]');
    const storedPayments = JSON.parse(localStorage.getItem('payments') || '[]');
    setMaintenanceRequests(storedRequests);
    setPayments(storedPayments);
  }, []);

  const handleStatusUpdate = (id, newStatus) => {
    const updated = maintenanceRequests.map(req =>
      req.id === id ? { ...req, status: newStatus } : req
    );
    setMaintenanceRequests(updated);
    localStorage.setItem('maintenanceRequests', JSON.stringify(updated));
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/';
  };

  const filteredRequests = maintenanceRequests.filter(req => {
    const matchesStatus = statusFilter === 'All' || req.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'All' || req.urgency === urgencyFilter;
    return matchesStatus && matchesUrgency;
  });

  const properties = [
    { id: 1, name: 'Sunset Apartments #101', tenants: 2 },
    { id: 2, name: 'Downtown Loft #205', tenants: 1 },
    { id: 3, name: 'Greenwood Villa', tenants: 3 },
    { id: 4, name: 'Riverside Condo #12', tenants: 1 },
  ];

  const totalProperties = properties.length;
  const activeTenants = properties.reduce((sum, prop) => sum + prop.tenants, 0);
  const pendingRequests = maintenanceRequests.filter(r => r.status === 'Pending').length;
  const overduePayments = payments.filter(p => p.status === 'Overdue').length;

  const recentPayments = payments.slice(0, 5);

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={handleLogout} title="Landlord Portal" />

      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800">Dashboard Overview</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-600 text-sm font-medium">Total Properties</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{totalProperties}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-gray-600 text-sm font-medium">Active Tenants</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">{activeTenants}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <h3 className="text-gray-600 text-sm font-medium">Pending Requests</h3>
            <p className="text-3xl font-bold text-yellow-600 mt-2">{pendingRequests}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <h3 className="text-gray-600 text-sm font-medium">Overdue Payments</h3>
            <p className="text-3xl font-bold text-red-600 mt-2">{overduePayments}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
              <h2 className="text-xl font-bold text-gray-800">Maintenance Requests</h2>
              <div className="flex flex-wrap gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <select
                  value={urgencyFilter}
                  onChange={(e) => setUrgencyFilter(e.target.value)}
                  className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Urgency</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Issue</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700 hidden md:table-cell">Property</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Urgency</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-4 py-6 text-center text-gray-500">
                        No maintenance requests found
                      </td>
                    </tr>
                  ) : (
                    filteredRequests.map((request) => (
                      <tr key={request.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800">{request.issue || request.title}</div>
                          <div className="text-xs text-gray-500 md:hidden">{request.property}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{request.property}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}>
                            {request.urgency}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={request.status}
                            onChange={(e) => handleStatusUpdate(request.id, e.target.value)}
                            className={`px-2 py-1 rounded-md text-xs font-medium border-0 ${getStatusColor(request.status)}`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Properties</h2>
            <div className="space-y-3">
              {properties.map((property) => (
                <div key={property.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{property.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{property.tenants} tenant{property.tenants !== 1 ? 's' : ''}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {property.tenants}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Payments</h2>
            <div className="space-y-3">
              {recentPayments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent payments</p>
              ) : (
                recentPayments.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-800">{payment.tenant || payment.property}</p>
                      <p className="text-xs text-gray-500 mt-1">{payment.date || new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">${payment.amount}</p>
                      <p className={`text-xs mt-1 ${payment.status === 'Paid' ? 'text-green-600' : 'text-red-600'}`}>
                        {payment.status || 'Paid'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <button className="bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition font-medium text-left flex items-center justify-between">
                <span>📋 View All Requests</span>
                <span>→</span>
              </button>
              <button className="bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition font-medium text-left flex items-center justify-between">
                <span>💬 Send Message</span>
                <span>→</span>
              </button>
              <button className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition font-medium text-left flex items-center justify-between">
                <span>📊 Generate Report</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordDashboard;
