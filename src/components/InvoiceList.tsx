import React, { useState, useEffect } from 'react';
import { Invoice, Customer } from '../types';
import { getCurrentUser } from '../utils/auth';
import { Mail, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { sendInvoiceReminder } from '../utils/emailService';
import { useNavigate } from 'react-router-dom';

export const InvoiceList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      const userInvoices = storedInvoices.filter(
        (invoice: Invoice) => invoice.userId === currentUser.id
      );
      setInvoices(userInvoices);
      setCustomers(JSON.parse(localStorage.getItem('customers') || '[]'));
    }
  }, []);

  const getCustomerById = (customerId: string) => {
    return customers.find((customer) => customer.id === customerId);
  };

  const handleSendEmail = async (invoice: Invoice) => {
    const customer = getCustomerById(invoice.customerId);
    if (!customer) {
      toast.error('Customer information not found');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendInvoiceReminder(
        customer.name,
        customer.email,
        invoice.total,
        invoice.dueDate
      );

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to send reminder email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (invoiceId: string) => {
    navigate(`/dashboard/details/${invoiceId}`);
  };

  const handleStatusChange = (invoiceId: string, newStatus: 'pending' | 'paid') => {
    const updatedInvoices = invoices.map((invoice) =>
      invoice.id === invoiceId ? { ...invoice, status: newStatus } : invoice
    );
    localStorage.setItem('invoices', JSON.stringify(updatedInvoices));
    setInvoices(updatedInvoices);
    toast.success('Invoice status updated');
  };

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => {
        const customer = getCustomerById(invoice.customerId);
        return (
          <div
            key={invoice.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{customer?.name}</h3>
                <p className="text-gray-600">{customer?.email}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">${invoice.total.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  Due: {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <select
                  value={invoice.status}
                  onChange={(e) =>
                    handleStatusChange(invoice.id, e.target.value as 'pending' | 'paid')
                  }
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    invoice.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div className="flex gap-2">
                {invoice.status === 'pending' && (
                  <button
                    onClick={() => handleSendEmail(invoice)}
                    disabled={isLoading}
                    className={`flex items-center gap-1 ${
                      isLoading
                        ? 'text-gray-400 cursor-not-allowed'
                        : 'text-blue-500 hover:text-blue-700'
                    }`}
                  >
                    <Mail size={18} />
                    {isLoading ? 'Sending...' : 'Send Reminder'}
                  </button>
                )}
                <button
                  onClick={() => handleViewDetails(invoice.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
                >
                  <FileText size={18} />
                  View Details
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {invoices.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No invoices found. Create your first invoice!
        </div>
      )}
    </div>
  );
};
