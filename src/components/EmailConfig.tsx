import React, { useState } from 'react';
import { getCurrentUser } from '../utils/auth';
import { toast } from 'react-hot-toast';
import { Mail, Key } from 'lucide-react';

export const EmailConfig: React.FC = () => {
  const currentUser = getCurrentUser();
  const [emailConfig, setEmailConfig] = useState({
    email: currentUser?.emailConfig?.email || '',
    appPassword: currentUser?.emailConfig?.appPassword || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: any) =>
      user.id === currentUser?.id
        ? { ...user, emailConfig }
        : user
    );
    
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    localStorage.setItem('currentUser', JSON.stringify({
      ...currentUser,
      emailConfig,
    }));
    
    toast.success('Email configuration saved successfully');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Gmail Address"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={emailConfig.email}
            onChange={(e) => setEmailConfig({ ...emailConfig, email: e.target.value })}
            required
          />
        </div>
        <div className="relative">
          <Key className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="App Password"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={emailConfig.appPassword}
            onChange={(e) => setEmailConfig({ ...emailConfig, appPassword: e.target.value })}
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Note: Use an App Password from your Google Account settings
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Email Configuration
        </button>
      </form>
    </div>
  );
};