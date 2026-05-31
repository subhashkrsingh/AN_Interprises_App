import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getServices } from '../api/index.js';
import Loader from '../components/Loader.jsx';

function Services() {
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

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Services | Best RO Water Purifier Sales & Service Provider</title>
      </Helmet>
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
          {services.map((service) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="section-card"
            >
              <div className="text-4xl">{service.icon}</div>
              <h2 className="mt-5 text-2xl font-semibold text-white">{service.title}</h2>
              <p className="mt-3 text-slate-300">{service.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}

export default Services;
