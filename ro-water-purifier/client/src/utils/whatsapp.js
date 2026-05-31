export const normalizePhoneNumber = (phoneNumber) => {
  if (phoneNumber === undefined || phoneNumber === null) {
    return '';
  }

  return String(phoneNumber).replace(/\D/g, '');
};

export const generateWhatsAppLink = (phoneNumber, message = '') => {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);

  if (!normalizedPhone) {
    throw new Error('WhatsApp phone number is required to generate the chat link.');
  }

  const encodedMessage = encodeURIComponent(message || 'Hello, I would like to connect with you.');
  return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
};

export const isValidWhatsAppNumber = (phoneNumber) => {
  const normalizedPhone = normalizePhoneNumber(phoneNumber);
  return normalizedPhone.length >= 10 && normalizedPhone.length <= 15;
};
