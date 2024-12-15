export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  emailConfig?: {
    email: string;
    appPassword: string;
  };
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
}

export interface Invoice {
  id: string;
  userId: string;
  customerId: string;
  items: InvoiceItem[];
  total: number;
  status: 'pending' | 'paid';
  date: string;
  dueDate: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  price: number;
}