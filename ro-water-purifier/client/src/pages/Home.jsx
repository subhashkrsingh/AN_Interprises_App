import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { getServices, getProducts, getTestimonials, getFaqs, submitContact } from '../api/index.js';
import FAQAccordion from '../components/FAQAccordion.jsx';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';

const checklist = [
  '100% Safe Drinking Water',
  'Expert RO Installation',
  'Fast Repair Service',
  'Affordable AMC Plans',
  'Genuine Filters & Spare Parts',
];

const reasons = [
  'Experienced RO technicians',
  'Affordable pricing',
  'Genuine spare parts',
  'Quick doorstep service',
  'Customer satisfaction guarantee',
  'Reliable after-sales support',
];

const initialForm = {
  name: '',
  phone: '',
  email: '',
  serviceType: 'RO Water Purifier Sales',
  message: '',
};

function Home() {
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactForm, setContactForm] = useState(initialForm);
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [serviceData, productData, testimonialData, faqData] = await Promise.all([
          getServices(),
          getProducts(),
          getTestimonials(),
          getFaqs(),
        ]);
        setServices(serviceData);
        setProducts(productData);
        setTestimonials(testimonialData);
        setFaqs(faqData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContactForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = async (event) => {
    event.preventDefault();
    setFormLoading(true);
    setToast({ message: '', type: 'success' });
    try {
      const response = await submitContact(contactForm);
      setToast({ message: response.message, type: 'success' });
      setContactForm(initialForm);
    } catch (error) {
      setToast({
        message: error?.response?.data?.message || 'Unable to send your request. Please try again.',
        type: 'error',
      });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-5 pb-16 sm:px-6 lg:px-8">
      <Helmet>
        <title>Best RO Water Purifier Sales & Service Provider</title>
      </Helmet>

      <section className="relative overflow-hidden rounded-[2rem] border border-slate-700/80 bg-navy/90 px-6 py-16 shadow-soft sm:px-12 sm:py-20 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-cyan font-semibold uppercase tracking-[0.35em]">Pure Water, Healthy Life</p>
          <h1 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Pure & Safe Drinking Water for Every Home
          </h1>
          <p className="section-subtitle mx-auto mt-6 text-slate-300">
            Advanced RO water purifiers, installation, repair & maintenance for homes, offices, schools & commercial spaces.
          </p>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {checklist.map((point) => (
              <div key={point} className="rounded-3xl bg-white/5 px-5 py-4 text-left text-slate-200 shadow-soft backdrop-blur-xl">
                {point}
              </div>
            ))}
          </div>

          <a
            href="#contact"
            className="mt-10 inline-flex rounded-full bg-cyan px-8 py-4 text-sm font-semibold text-navy transition hover:bg-white"
          >
            Book Your RO Service Today
          </a>
        </motion.div>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-[0.9fr,0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-card"
        >
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">About Us</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Trusted RO Water Purifier Experts</h2>
          <p className="mt-5 text-slate-300">
            We are dedicated to keeping families healthy by delivering reliable water purification solutions. From product selection to installation and ongoing maintenance, our team makes safe drinking water simple.
          </p>
          <p className="mt-4 text-slate-300">
            With fast response times, skilled technicians and affordable AMC plans, we support homes and commercial customers across all RO service needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="section-card bg-cyan/5"
        >
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">Our Services</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Complete RO Services</h2>
          <div className="mt-8 grid gap-4">
            {['RO Water Purifier Sales', 'RO Installation Service', 'RO Repair & Maintenance', 'Filter & Membrane Replacement', 'AMC Plans'].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-700/70 bg-navy/70 p-5 text-slate-200">
                <h3 className="font-semibold text-white">{item}</h3>
                <p className="mt-2 text-slate-300">Professional support for every stage of your RO purifier lifecycle.</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="mt-16">
        <div className="mb-10 text-center">
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">Our Products</p>
          <h2 className="section-title mt-4">RO Systems for Home and Business</h2>
          <p className="section-subtitle mx-auto mt-4">
            Discover domestic, commercial and smart water purification products designed for long-term performance.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {products.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="section-card"
              >
                <span className="inline-flex rounded-full bg-cyan/10 px-3 py-2 text-sm font-semibold text-cyan">
                  {product.category}
                </span>
                <h3 className="mt-5 text-2xl font-semibold text-white">{product.name}</h3>
                <p className="mt-3 text-slate-300">{product.description}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <div className="mb-10 text-center">
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">Why Choose Us</p>
          <h2 className="section-title mt-4">Trusted Service with Every Installation</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {reasons.map((reason) => (
            <motion.div
              key={reason}
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="section-card flex items-start gap-4"
            >
              <div className="mt-1 rounded-2xl bg-cyan/10 p-3 text-2xl">✔️</div>
              <p className="text-slate-200">{reason}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-10 text-center">
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">Testimonials</p>
          <h2 className="section-title mt-4">Customers Love Our RO Services</h2>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="section-card"
              >
                <div className="mb-4 flex gap-1 text-amber-300">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="text-slate-300">“{testimonial.text}”</p>
                <p className="mt-6 text-sm font-semibold text-white">{testimonial.author}</p>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <section className="mt-16">
        <div className="mb-10 text-center">
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">FAQ</p>
          <h2 className="section-title mt-4">Frequently Asked Questions</h2>
        </div>

        {loading ? <Loader /> : <FAQAccordion items={faqs} />}
      </section>

      <section id="contact" className="mt-16">
        <div className="mb-10 text-center">
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">Contact Us</p>
          <h2 className="section-title mt-4">Book a Service or Ask a Question</h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.15fr,0.85fr]">
          <motion.form
            onSubmit={handleContactSubmit}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-card"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Name
                <input
                  type="text"
                  name="name"
                  value={contactForm.name}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan"
                  required
                />
              </label>
              <label className="flex flex-col gap-2 text-sm text-slate-200">
                Phone
                <input
                  type="text"
                  name="phone"
                  value={contactForm.phone}
                  onChange={handleChange}
                  className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan"
                  required
                />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Email
              <input
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleChange}
                className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan"
                required
              />
            </label>
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Service Type
              <select
                name="serviceType"
                value={contactForm.serviceType}
                onChange={handleChange}
                className="rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-white outline-none transition focus:border-cyan"
              >
                {['RO Water Purifier Sales', 'RO Installation Service', 'RO Repair & Maintenance', 'Filter & Membrane Replacement', 'AMC Plans'].map((option) => (
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
                rows="5"
                value={contactForm.message}
                onChange={handleChange}
                className="min-h-[150px] rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-4 text-white outline-none transition focus:border-cyan"
                required
              />
            </label>
            <button
              type="submit"
              disabled={formLoading}
              className="inline-flex items-center justify-center rounded-full bg-cyan px-8 py-4 text-sm font-semibold text-navy transition hover:bg-white"
            >
              {formLoading ? 'Submitting...' : 'Send Message'}
            </button>
            {toast.message && <Toast type={toast.type} message={toast.message} />}
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="section-card">
              <h3 className="text-2xl font-semibold text-white">Call Us</h3>
              <p className="mt-3 text-slate-300">+91 98765 43210</p>
            </div>
            <div className="section-card">
              <h3 className="text-2xl font-semibold text-white">Email Us</h3>
              <p className="mt-3 text-slate-300">support@ropurecare.com</p>
            </div>
            <div className="section-card">
              <h3 className="text-2xl font-semibold text-white">Visit Our Store</h3>
              <p className="mt-3 text-slate-300">123 Aqua Lane, Clean City</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default Home;
