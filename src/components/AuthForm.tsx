import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser } from '../utils/auth';
import { toast } from 'react-hot-toast';
import { UserCircle2, Lock, Mail } from 'lucide-react';

interface AuthFormProps {
  type: 'login' | 'register';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { email, password, name } = formData;
    const result = type === 'register'
      ? await registerUser(name, email, password)
      : await loginUser(email, password);

    if (result.success) {
      toast.success(result.message);
      navigate(type === 'register' ? '/login' : '/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  // Rest of the component remains the same
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {type === 'login' ? 'Login' : 'Register'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'register' && (
            <div className="relative">
              <UserCircle2 className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {type === 'login' ? 'Login' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          {type === 'login' ? (
            <>
              Don't have an account?{' '}
              <a href="/register" className="text-blue-500 hover:underline">
                Register
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 hover:underline">
                Login
              </a>
            </>
          )}
        </p>
      </div>
    </div>
  );
};