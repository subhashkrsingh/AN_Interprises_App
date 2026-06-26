import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getServices } from '../api/index.js';
import Loader from '../components/Loader.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.jsx';
import {
  lifeguardRo,
  lifeguardBooster,
  lifeguardMax,
  lifeguardPurix1,
  serviceInstall,
  serviceRepair,
  serviceMaintenance,
} from '../assets/images/index.js';

const serviceImages = {
  'RO Water Purifier Sales': lifeguardRo,
  'RO Installation Service': serviceInstall,
  'RO Repair & Maintenance': serviceRepair,
  'Filter & Membrane Replacement': serviceMaintenance,
  'AMC Plans': serviceMaintenance,
};

const serviceIcons = {
  'RO Water Purifier Sales': '🛒',
  'RO Installation Service': '🔧',
  'RO Repair & Maintenance': '🛠️',
  'Filter & Membrane Replacement': '🔄',
  'AMC Plans': '📋',
};

function Services() {
  useDocumentTitle('Services | Best RO Water Purifier Sales & Service Provider');

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getServices();
        setServices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <p className="text-cyan font-semibold uppercase tracking-[0.3em]">Our Services</p>
        <h1 className="section-title mt-4">Complete RO Service & Support</h1>
        <p className="section-subtitle mx-auto mt-4">
          Explore our services for RO purifier sales, installation, repair, filter replacement and AMC plans.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-2">
          {services.map((service) => {
            const orderMessage = `Hello, I want to order:
Service: ${service.title}
ID: ${service.id}
Price: ${service.price ?? 'Contact for price'}
Quantity: 1`;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-card overflow-hidden hover:border-cyan/50 transition-colors"
              >
                <div className="overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-950/60 h-56 flex items-center justify-center">
                  <img
                    src={service.image || serviceImages[service.title] || lifeguardRo}
                    alt={service.title}
                    className="w-full h-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-3xl">{serviceIcons[service.title] || service.icon || '🔹'}</span>
                  <h2 className="text-2xl font-semibold text-white">{service.title}</h2>
                </div>
                <p className="mt-3 text-slate-300">{service.description}</p>
                <p className="mt-4 text-slate-200">
                  <span className="font-semibold text-white">Price:</span> {service.price ?? 'Contact for price'}
                </p>
                <div className="mt-6">
                  <WhatsAppButton
                    phoneNumber={whatsappNumber}
                    message={orderMessage}
                    type="order"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default Services;