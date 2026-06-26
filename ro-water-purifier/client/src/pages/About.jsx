import { motion } from 'framer-motion';
import useDocumentTitle from '../hooks/useDocumentTitle.jsx';

function About() {
  useDocumentTitle('About Us | Best RO Water Purifier Sales & Service Provider');

  return (
    <main className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-10 text-center">
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">About Us</p>
          <h1 className="section-title mt-4">Trusted RO Water Purifier Experts</h1>
          <p className="section-subtitle mx-auto mt-5">
            We deliver dependable RO purifier sales, installation and maintenance for homes, offices and institutions.
            Our team supports every step from system selection to long-term filter servicing.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="section-card">
            <h2 className="text-2xl font-semibold text-white">Our mission</h2>
            <p className="mt-4 text-slate-300">
              We aim to make clean drinking water accessible and affordable for every household. Using trusted RO brands,
              we combine excellent installation with responsive maintenance and full after-sales support.
            </p>
          </div>
          <div className="section-card">
            <h2 className="text-2xl font-semibold text-white">Why customers trust us</h2>
            <p className="mt-4 text-slate-300">
              Our certified technicians provide fast, safe service with genuine parts. We prioritize customer satisfaction,
              transparent pricing and long-term performance for every purifier system.
            </p>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default About;
