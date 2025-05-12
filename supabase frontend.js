import React, { useState, useEffect } from 'react';
import { Package, DollarSign, Users, FileText, ClipboardList } from 'lucide-react';

// Supabase configuration
const SUPABASE_URL = 'https://gowugygxriprrudlasbx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdvd3VneWd4cmlwcnJ1ZGxhc2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MjU4NzQsImV4cCI6MjA2MjIwMTg3NH0.mAe2UMe13zg5OVHI8Co9hkz34cOuKOmPWXCfOrI-74g';

// Supabase client initialization (simplified for demo)
const supabase = {
  from: (table) => ({
    select: async () => {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  })
};

// Main Dashboard Component
const Dashboard = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Garments Industry Management</h1>
        <p className="text-gray-600 mb-8">Manage your operations efficiently</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Production Overview Card */}
          <div 
            onClick={() => onNavigate('production')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Production Overview</h2>
              <Package className="text-blue-500" size={32} />
            </div>
            <p className="text-gray-600">View and manage production data</p>
          </div>

          {/* Costs Card */}
          <div 
            onClick={() => onNavigate('costs')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Costs</h2>
              <DollarSign className="text-green-500" size={32} />
            </div>
            <p className="text-gray-600">Track and analyze costing information</p>
          </div>

          {/* Employees Card */}
          <div 
            onClick={() => onNavigate('employees')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Employees</h2>
              <Users className="text-purple-500" size={32} />
            </div>
            <p className="text-gray-600">Manage employee information</p>
          </div>

          {/* Orders Card */}
          <div 
            onClick={() => onNavigate('orders')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Orders</h2>
              <ClipboardList className="text-orange-500" size={32} />
            </div>
            <p className="text-gray-600">View and manage orders</p>
          </div>

          {/* Reports Card */}
          <div 
            onClick={() => onNavigate('reports')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Reports</h2>
              <FileText className="text-red-500" size={32} />
            </div>
            <p className="text-gray-600">Generate and view reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Generic Table Component for displaying data
const DataTable = ({ title, data, tableName, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from(tableName).select();
        
        if (error) {
          setError(error.message);
        } else {
          setTableData(data || []);
        }
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tableName]);

  const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
          <button
            onClick={onBack}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            Error: {error}
          </div>
        )}

        {!loading && !error && tableData.length === 0 && (
          <div className="text-center py-8 text-gray-600">
            No data available in {tableName} table
          </div>
        )}

        {!loading && !error && tableData.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      {columns.map((column) => (
                        <td key={column} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {row[column]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleBack = () => {
    setCurrentView('dashboard');
  };

  const pageConfigs = {
    production: { title: 'Production Overview', tableName: 'production' },
    costs: { title: 'Costs Management', tableName: 'costing' },
    employees: { title: 'Employee Management', tableName: 'employees' },
    orders: { title: 'Orders Management', tableName: 'orders' },
    reports: { title: 'Reports', tableName: 'reports' }
  };

  if (currentView === 'dashboard') {
    return <Dashboard onNavigate={handleNavigate} />;
  }

  const config = pageConfigs[currentView];
  return (
    <DataTable
      title={config.title}
      tableName={config.tableName}
      onBack={handleBack}
    />
  );
}