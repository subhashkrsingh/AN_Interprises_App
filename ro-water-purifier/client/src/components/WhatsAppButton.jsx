import PropTypes from 'prop-types';
import { FaWhatsapp } from 'react-icons/fa';
import { generateWhatsAppLink, isValidWhatsAppNumber } from '../utils/whatsapp.js';

const DEFAULT_LABELS = {
  contact: 'Contact on WhatsApp',
  order: 'Place Order via WhatsApp',
  support: 'Get Support',
};

function WhatsAppButton({ phoneNumber, message, type, isFloating = false }) {
  const isPhoneValid = isValidWhatsAppNumber(phoneNumber);
  const isLoading = phoneNumber === undefined;
  const buttonLabel = DEFAULT_LABELS[type] || 'WhatsApp Chat';
  const ariaLabel = isLoading
    ? 'Loading WhatsApp chat button'
    : isPhoneValid
    ? `Open WhatsApp chat to ${buttonLabel}`
    : 'WhatsApp number is missing or invalid';

  let chatLink = '#';
  let hasError = false;

  try {
    chatLink = generateWhatsAppLink(phoneNumber, message);
  } catch (error) {
    hasError = true;
  }

  const sharedClasses =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-emerald-300/50';
  const styleClasses = isFloating
    ? 'whatsapp-fab fixed bottom-5 right-5 z-50 shadow-soft'
    : 'whatsapp-button';
  const disabledClasses = hasError || isLoading ? 'cursor-not-allowed opacity-60' : 'hover:bg-emerald-400';

  return (
    <a
      href={isPhoneValid ? chatLink : '#'}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`${sharedClasses} ${styleClasses} ${disabledClasses}`}
      onClick={(event) => {
        if (!isPhoneValid || isLoading) {
          event.preventDefault();
        }
      }}
      aria-disabled={!isPhoneValid || isLoading}
      title={hasError ? 'Missing WhatsApp number' : undefined}
    >
      <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
      {isFloating ? <span className="sr-only">Open WhatsApp chat</span> : buttonLabel}
    </a>
  );
}

WhatsAppButton.propTypes = {
  phoneNumber: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['contact', 'order', 'support']).isRequired,
  isFloating: PropTypes.bool,
};

WhatsAppButton.defaultProps = {
  phoneNumber: undefined,
  isFloating: false,
};

export default WhatsAppButton;
