import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContact } from '../api/index.js';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.jsx';

const serviceOptions = [
  'RO Water Purifier Sales',
  'RO Installation Service',
  'RO Repair & Maintenance',
  'Filter & Membrane Replacement',
  'AMC Plans',
];

function Contact() {
  useDocumentTitle('Contact | Best RO Water Purifier Sales & Service Provider');

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const contactMessage = 'Hello, I would like to know more about your services.';
  const supportMessage = 'Hello Support Team, I need assistance regarding my account/order.';

  const [form, setForm] = useState({ name: '', phone: '', email: '', serviceType: serviceOptions[0], message: '' });
  const [status, setStatus] = useState({ loading: false, message: '', type: 'success' });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ loading: true, message: '', type: 'success' });
    try {
      const response = await submitContact(form);
      setStatus({ loading: false, message: response.message, type: 'success' });
      setForm({ name: '', phone: '', email: '', serviceType: serviceOptions[0], message: '' });
    } catch (error) {
      setStatus({
        loading: false,
        message: error?.response?.data?.message || 'Submission failed. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-cyan font-semibold uppercase tracking-[0.3em]">Get in Touch</p>
        <h1 className="section-title mt-4">Contact Our RO Experts</h1>
        <p className="section-subtitle mx-auto mt-4">
          Reach out to book installation, repair or AMC services. Our team is ready to help with quick doorstep support.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:justify-center">
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            message={contactMessage}
            type="contact"
          />
          <WhatsAppButton
            phoneNumber={whatsappNumber}
            message={supportMessage}
            type="support"
          />
        </div>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1.2fr,0.8fr]">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="section-card space-y-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Name
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan"
                required
              />
            </label>
          </div>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Service Type
            <select
              name="serviceType"
              value={form.serviceType}
              onChange={handleChange}
              className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan"
            >
              {serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Message
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows="5"
              className="min-h-[140px] rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white outline-none transition focus:border-cyan"
              required
            />
          </label>
          <button
            type="submit"
            disabled={status.loading}
            className="inline-flex items-center justify-center rounded-full bg-cyan px-8 py-3 text-sm font-semibold text-navy transition hover:bg-white"
          >
            {status.loading ? 'Sending...' : 'Submit Request'}
          </button>
          {status.message && <Toast type={status.type} message={status.message} />}
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <div className="section-card">
            <h2 className="text-2xl font-semibold text-white">Contact Details</h2>
            <p className="mt-4 text-slate-300">
              Our specialists are ready to answer your questions and schedule service visits.
            </p>
          </div>
          <div className="section-card space-y-4">
            <div className="flex items-start gap-4">
              <span className="text-2xl">📞</span>
              <div>
                <h3 className="font-semibold text-white">Call Us</h3>
                <p className="text-slate-300">+91 9560342801</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">✉️</span>
              <div>
                <h3 className="font-semibold text-white">Email Us</h3>
                <p className="text-slate-300">guptaashu421@gmail.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-2xl">📌</span>
              <div>
                <h3 className="font-semibold text-white">Visit Our Store</h3>
                <p className="text-slate-300"></p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}

export default Contact;
