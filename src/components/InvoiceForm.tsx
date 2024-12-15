import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getCurrentUser } from '../utils/auth';
import { Customer, Invoice, InvoiceItem } from '../types';
import { PlusCircle, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { jsPDF } from 'jspdf';

export const InvoiceForm: React.FC = () => {
  const [customer, setCustomer] = useState<Customer>({
    id: uuidv4(),
    name: '',
    email: '',
    address: '',
    phone: '',
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: uuidv4(), description: '', quantity: 1, price: 0 },
  ]);

  const [dueDate, setDueDate] = useState('');

  const handleAddItem = () => {
    setItems([...items, { id: uuidv4(), description: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      toast.error('Please login first');
      return;
    }

    const invoice: Invoice = {
      id: uuidv4(),
      userId: currentUser.id,
      customerId: customer.id,
      items,
      total: calculateTotal(),
      status: 'pending',
      date: new Date().toISOString(),
      dueDate,
    };

    // Save invoice to local storage
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    localStorage.setItem('invoices', JSON.stringify([...invoices, invoice]));

    // Save customer if new
    const customers = JSON.parse(localStorage.getItem('customers') || '[]');
    if (!customers.some((c: Customer) => c.email === customer.email)) {
      localStorage.setItem('customers', JSON.stringify([...customers, customer]));
    }

    toast.success('Invoice created successfully');
  };

  const downloadInvoice = () => {
    const doc = new jsPDF();
  
    // Adding invoice header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Invoice', 20, 20);
  
    // Adding customer details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    let yPosition = 30;
    doc.text(`Customer: ${customer.name}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Email: ${customer.email}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Address: ${customer.address}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Phone: ${customer.phone}`, 20, yPosition);
  
    // Adding a separator line
    yPosition += 20;
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 180, yPosition); // Draw line at yPosition
    yPosition += 10;
  
    // Adding the table headers for items
    doc.setFontSize(14);
    doc.text('Description', 20, yPosition);
    doc.text('Quantity', 100, yPosition);
    doc.text('Price', 140, yPosition);
    yPosition += 10;
  
    // Table rows for invoice items
    items.forEach((item) => {
      doc.text(item.description, 20, yPosition);
      doc.text(item.quantity.toString(), 100, yPosition);
      doc.text(item.price.toFixed(2), 140, yPosition);
      yPosition += 10;
    });
  
    // Adding another separator line after the items table
    doc.setLineWidth(0.5);
    doc.line(20, yPosition, 180, yPosition); // Draw line at yPosition
    yPosition += 10;
  
    // Displaying the total amount
    doc.setFontSize(12);
    doc.text(`Total: $${calculateTotal().toFixed(2)}`, 20, yPosition);
  
    // Displaying the due date
    yPosition += 10;
    doc.text(`Due Date: ${dueDate}`, 20, yPosition);
  
    // Retrieve logged-in user from local storage to show the digital signature
    const loggedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userName = loggedUser.name || 'No User'; // Fallback to 'No User' if no user is found
  
    // Adding the digital signature at the bottom-right
    const pageWidth = doc.internal.pageSize.width; // Get page width
    const margin = 20; // Define margin from the right edge
    const signatureX = pageWidth - margin - doc.getTextWidth(`Digital Signature: ${userName}`); // Calculate X position
    const signatureY = doc.internal.pageSize.height - margin; // Y position near bottom
  
    doc.setFont('helvetica', 'italic');
    doc.text(`Digital Signature: ${userName}`, signatureX, signatureY);
  
    // Save the PDF
    doc.save('invoice.pdf');
  };
  
  

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            className="p-2 border rounded"
            value={customer.name}
            onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Customer Email"
            className="p-2 border rounded"
            value={customer.email}
            onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="p-2 border rounded"
            value={customer.address}
            onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone"
            className="p-2 border rounded"
            value={customer.phone}
            onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Invoice Items</h3>
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Description"
              className="flex-1 p-2 border rounded"
              value={item.description}
              onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              className="w-24 p-2 border rounded"
              value={item.quantity}
              onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value))}
              min="1"
              required
            />
            <input
              type="number"
              placeholder="Price"
              className="w-32 p-2 border rounded"
              value={item.price}
              onChange={(e) => handleItemChange(item.id, 'price', parseFloat(e.target.value))}
              min="0"
              step="0.01"
              required
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddItem}
          className="flex items-center gap-2 text-blue-500 hover:text-blue-700"
        >
          <PlusCircle size={20} />
          Add Item
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700">Due Date</label>
            <input
              type="date"
              className="mt-1 p-2 border rounded"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Total: ${calculateTotal().toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create Invoice
        </button>
        <button
          type="button"
          onClick={downloadInvoice}
          className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
        >
          Download Invoice
        </button>
      </div>
    </form>
  );
};
