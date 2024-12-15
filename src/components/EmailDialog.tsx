import React, { useState } from 'react';
import { Mail, Key, X } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EmailDialogProps {
  customerEmail: string;
  onClose: () => void;
  onSend: (credentials: { email: string; appPassword: string }) => void;
}

export const EmailDialog: React.FC<EmailDialogProps> = ({
  customerEmail,
  onClose,
  onSend,
}) => {
  const [credentials, setCredentials] = useState({
    email: '',
    appPassword: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(credentials);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <h3 className="text-lg font-semibold mb-4">Send Invoice Reminder</h3>
        <p className="text-sm text-gray-600 mb-4">
          Sending to: {customerEmail}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Your Gmail Address"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={credentials.email}
              onChange={(e) =>
                setCredentials({ ...credentials, email: e.target.value })
              }
              required
            />
          </div>
          
          <div className="relative">
            <Key className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="App Password"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={credentials.appPassword}
              onChange={(e) =>
                setCredentials({ ...credentials, appPassword: e.target.value })
              }
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Use an App Password from your Google Account settings
            </p>
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Send Reminder
          </button>
        </form>
      </div>
    </div>
  );
};