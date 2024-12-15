import React from 'react';
import { useParams } from 'react-router-dom';
import { Invoice, Customer } from '../types';
import jsPDF from 'jspdf';
import 'jspdf-autotable'; // Importing autoTable plugin to handle tables in jsPDF

export const InvoiceDetails: React.FC = () => {
  const { id } = useParams();
  const invoices: Invoice[] = JSON.parse(localStorage.getItem('invoices') || '[]');
  const customers: Customer[] = JSON.parse(localStorage.getItem('customers') || '[]');

  const invoice = invoices.find((inv) => inv.id === id);
  const customer = customers.find((cust) => cust.id === invoice?.customerId);

  if (!invoice || !customer) {
    return <div>Invoice not found!</div>;
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Set title for the invoice
    doc.setFontSize(18);
    doc.text(`Invoice for ${customer.name}`, 14, 22);

    // Customer information
    doc.setFontSize(12);
    doc.text(`Customer: ${customer.name}`, 14, 40);
    doc.text(`Email: ${customer.email}`, 14, 50);
    doc.text(`Invoice Number: ${invoice.id}`, 14, 60);
    doc.text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 14, 70);

    // Draw a line separator after customer info
    doc.line(14, 75, 200, 75);

    // Table header and data
    const tableColumn = ["Item", "Description", "Quantity", "Unit Price", "Total"];
    const tableRows: string[][] = invoice.items.map(item => [
      item.name,
      item.description,
      item.quantity.toString(),
      `$${item.unitPrice.toFixed(2)}`,
      `$${(item.quantity * item.unitPrice).toFixed(2)}`
    ]);

    // Adding the table to the PDF with borders and styling
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 80,  // Start the table from Y position
      theme: 'grid',
      headStyles: { fillColor: [0, 122, 255], textColor: [255, 255, 255], fontSize: 10 },
      bodyStyles: { fontSize: 10, lineWidth: 0.1, lineColor: [0, 0, 0] }, // Set borders for the table cells
      styles: {
        cellPadding: 5,  // Add padding inside cells
        overflow: 'linebreak',  // Handle text overflow
        font: 'helvetica',  // Use Helvetica font for the content
      },
    });

    // Calculate and display total amount
    const totalAmount = invoice.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 10);

    // Add Digital Signature text at the bottom
    const signatureText = "Digital Signature: [Your Signature Here]";
    doc.setFontSize(10);
    doc.text(signatureText, 14, doc.lastAutoTable.finalY + 20);

    // Save the generated PDF
    doc.save(`Invoice_${invoice.id}.pdf`);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
      <p><strong>Customer:</strong> {customer.name}</p>
      <p><strong>Email:</strong> {customer.email}</p>
      <p><strong>Invoice Number:</strong> {invoice.id}</p>
      <p><strong>Total:</strong> ${invoice.total.toFixed(2)}</p>
      <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>

      <button
        onClick={handleDownloadPDF}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Download PDF
      </button>
    </div>
  );
};
