import { User } from '../types';
import { hashPassword } from './crypto';
import { getStoredUsers, saveUser, setCurrentUser, getCurrentUser } from './storage';
import { validateEmail, validatePassword } from './validation';

export { getCurrentUser };  // Re-export getCurrentUser from storage

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  if (!validateEmail(email)) {
    return { success: false, message: 'Invalid email format' };
  }

  if (!validatePassword(password)) {
    return { success: false, message: 'Password must be at least 6 characters' };
  }

  const users = getStoredUsers();
  if (users.some((user) => user.email === email)) {
    return { success: false, message: 'Email already exists' };
  }

  const hashedPassword = await hashPassword(password);
  const newUser: User = {
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
    name,
  };

  saveUser(newUser);
  return { success: true, message: 'Registration successful' };
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ success: boolean; message: string }> => {
  const users = getStoredUsers();
  const hashedPassword = await hashPassword(password);
  const user = users.find(
    (u) => u.email === email && u.password === hashedPassword
  );

  if (user) {
    setCurrentUser(user);
    return { success: true, message: 'Login successful' };
  }

  return { success: false, message: 'Invalid credentials' };
};