import emailjs from '@emailjs/browser';

interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

const EMAIL_CONFIG: EmailConfig = {
  serviceId: 'service_acn04dh',
  templateId: 'template_3z5dkes',
  publicKey: 'MC3HHsaBoGn2mOuUU',
};

export const sendInvoiceReminder = async (
  customerName: string,
  customerEmail: string,
  invoiceAmount: number,
  dueDate: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Create the template parameters including the customer's email as the recipient
    const templateParams = {
      to_name: customerName,
      customer_email: customerEmail, // Make sure this matches your EmailJS template variable
      invoice_amount: invoiceAmount.toFixed(2),
      due_date: new Date(dueDate).toLocaleDateString(),
      // Add any other template variables you need
    };

    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      templateParams,
      {
        publicKey: EMAIL_CONFIG.publicKey,
      }
    );

    if (response.status === 200) {
      return { 
        success: true, 
        message: `Reminder email sent successfully to ${customerEmail}` 
      };
    } else {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    return { 
      success: false, 
      message: `Failed to send reminder email to ${customerEmail}` 
    };
  }
};
