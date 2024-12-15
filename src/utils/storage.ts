import { User, Customer, Invoice } from '../types';

export const getStoredUsers = (): User[] => {
  const users = localStorage.getItem('users');
  return users ? JSON.parse(users) : [];
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem('currentUser');
  return user ? JSON.parse(user) : null;
};

export const saveUser = (user: User): void => {
  const users = getStoredUsers();
  localStorage.setItem('users', JSON.stringify([...users, user]));
};

export const setCurrentUser = (user: User): void => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

export const removeCurrentUser = (): void => {
  localStorage.removeItem('currentUser');
};

export const getStoredCustomers = (): Customer[] => {
  const customers = localStorage.getItem('customers');
  return customers ? JSON.parse(customers) : [];
};

export const saveCustomer = (customer: Customer): void => {
  const customers = getStoredCustomers();
  localStorage.setItem('customers', JSON.stringify([...customers, customer]));
};

export const getStoredInvoices = (): Invoice[] => {
  const invoices = localStorage.getItem('invoices');
  return invoices ? JSON.parse(invoices) : [];
};

export const saveInvoice = (invoice: Invoice): void => {
  const invoices = getStoredInvoices();
  localStorage.setItem('invoices', JSON.stringify([...invoices, invoice]));
};

export const updateInvoices = (invoices: Invoice[]): void => {
  localStorage.setItem('invoices', JSON.stringify(invoices));
};