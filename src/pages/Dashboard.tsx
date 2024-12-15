import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { InvoiceForm } from '../components/InvoiceForm';
import { InvoiceList } from '../components/InvoiceList';
import { EmailConfig } from '../components/EmailConfig';
import { InvoiceDetails } from '../components/InvoiceDetails';
import { getCurrentUser } from '../utils/auth';
import { FileText, PlusCircle, LogOut, Settings } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const location = useLocation();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">EasyInvoicePro</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">Welcome, {currentUser?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8">
          <Link
            to="/dashboard"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              location.pathname === '/dashboard'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <FileText size={20} />
            Invoices
          </Link>
          <Link
            to="/dashboard/new"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              location.pathname === '/dashboard/new'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <PlusCircle size={20} />
            New Invoice
          </Link>
          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              location.pathname === '/dashboard/settings'
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Settings size={20} />
            Settings
          </Link>
        </div>

        <Routes>
          <Route path="/" element={<InvoiceList />} />
          <Route path="/new" element={<InvoiceForm />} />
          <Route path="/settings" element={<EmailConfig />} />
          <Route path="/details/:id" element={<InvoiceDetails />} />
        </Routes>
      </div>
    </div>
  );
};
