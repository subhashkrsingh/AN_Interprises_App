import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getServices, getProducts, getTestimonials, getFaqs, submitContact } from '../api/index.js';
import FAQAccordion from '../components/FAQAccordion.jsx';
import Loader from '../components/Loader.jsx';
import Toast from '../components/Toast.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.jsx';
import {
  heroBg,
  lifeguardRo,
  lifeguardBooster,
  lifeguardMax,
  lifeguardPurix1,
  lifeguardPurix2,
  lifeguardPurixCopper,
  serviceInstall,
  serviceRepair,
  serviceMaintenance,
  testimonial1,
  testimonial2,
  testimonial3,
} from '../assets/images/index.js';

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

// Product images mapping with LifeGuard models
const productImages = {
  'LifeGuard RO': lifeguardRo,
  'LifeGuard Booster': lifeguardBooster,
  'LifeGuard MAX': lifeguardMax,
  'LifeGuard PURIX': lifeguardPurix1,
  'LifeGuard PURIX Copper': lifeguardPurixCopper,
  'LifeGuard Alkaline': lifeguardPurix2,
  'RO Water Purifier': lifeguardRo,
  'RO Water Purifier Domestic': lifeguardBooster,
  'RO Water Purifier Commercial': lifeguardMax,
  'RO Water Purifier Smart': lifeguardPurix1,
};

const serviceImagesMap = {
  'RO Water Purifier Sales': lifeguardRo,
  'RO Installation Service': serviceInstall,
  'RO Repair & Maintenance': serviceRepair,
  'Filter & Membrane Replacement': serviceMaintenance,
  'AMC Plans': serviceMaintenance,
};

function Home() {
  useDocumentTitle('Best RO Water Purifier Sales & Service Provider');

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
      {/* Hero Section with Background Image */}
      <section 
        className="relative overflow-hidden rounded-[2rem] border border-slate-700/80 px-6 py-16 shadow-soft sm:px-12 sm:py-20 lg:px-16"
        style={{
          backgroundImage: `linear-gradient(rgba(10, 22, 40, 0.85), rgba(10, 22, 40, 0.92)), url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
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

      {/* About & Services Section with Images */}
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
            {[
              { name: 'RO Water Purifier Sales', icon: '🛒', img: lifeguardRo },
              { name: 'RO Installation Service', icon: '🔧', img: serviceInstall },
              { name: 'RO Repair & Maintenance', icon: '🛠️', img: serviceRepair },
              { name: 'Filter & Membrane Replacement', icon: '🔄', img: serviceMaintenance },
              { name: 'AMC Plans', icon: '📋', img: serviceMaintenance },
            ].map((item) => (
              <div key={item.name} className="rounded-3xl border border-slate-700/70 bg-navy/70 p-5 text-slate-200 flex items-center gap-4 hover:border-cyan/50 transition-colors">
                <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden bg-cyan/10 flex items-center justify-center">
                  <img 
                    src={item.img} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="mt-1 text-slate-300 text-sm">Professional support for every stage of your RO purifier lifecycle.</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Products Section with LifeGuard Images */}
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => {
              const productImage = productImages[product.name] || 
                (index % 3 === 0 ? lifeguardRo : 
                 index % 3 === 1 ? lifeguardBooster : 
                 lifeguardMax);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="section-card overflow-hidden hover:border-cyan/50 transition-colors"
                >
                  <div className="overflow-hidden rounded-2xl bg-slate-800/50 h-56 flex items-center justify-center">
                    <img 
                      src={product.image || productImage} 
                      alt={product.name}
                      className="w-full h-full object-contain transition duration-500 hover:scale-105 p-2"
                      loading="lazy"
                    />
                  </div>
                  <span className="inline-flex rounded-full bg-cyan/10 px-3 py-2 text-sm font-semibold text-cyan mt-4">
                    {product.category || 'RO System'}
                  </span>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{product.name}</h3>
                  <p className="mt-3 text-slate-300">{product.description}</p>
                  {product.price && (
                    <p className="mt-4 text-lg font-semibold text-cyan">{product.price}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* Why Choose Us */}
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
              className="section-card flex items-start gap-4 hover:border-cyan/50 transition-colors"
            >
              <div className="mt-1 rounded-2xl bg-cyan/10 p-3 text-2xl">✔️</div>
              <p className="text-slate-200">{reason}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials with Images */}
      <section className="mt-16">
        <div className="mb-10 text-center">
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">Testimonials</p>
          <h2 className="section-title mt-4">Customers Love Our RO Services</h2>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => {
              const testimonialImages = [testimonial1, testimonial2, testimonial3];
              return (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="section-card hover:border-cyan/50 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-cyan/10 flex-shrink-0">
                      <img 
                        src={testimonialImages[index % testimonialImages.length]} 
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{testimonial.author}</p>
                      <div className="flex gap-1 text-amber-300 text-sm">
                        {'★'.repeat(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300">“{testimonial.text}”</p>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>

      {/* FAQ Section */}
      <section className="mt-16">
        <div className="mb-10 text-center">
          <p className="text-cyan font-semibold uppercase tracking-[0.3em]">FAQ</p>
          <h2 className="section-title mt-4">Frequently Asked Questions</h2>
        </div>

        {loading ? <Loader /> : <FAQAccordion items={faqs} />}
      </section>

      {/* Contact Section */}
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
            <div className="section-card hover:border-cyan/50 transition-colors">
              <h3 className="text-2xl font-semibold text-white">Call Us</h3>
              <p className="mt-3 text-slate-300">+91 9560342801</p>
            </div>
            <div className="section-card hover:border-cyan/50 transition-colors">
              <h3 className="text-2xl font-semibold text-white">Email Us</h3>
              <p className="mt-3 text-slate-300">guptaashu421@gmail.com</p>
            </div>
            <div className="section-card hover:border-cyan/50 transition-colors">
              <h3 className="text-2xl font-semibold text-white">Visit Our Store</h3>
              <p className="mt-3 text-slate-300">BH-28 NTPC TOWNSHIP VIDHUYT NAGAR DADRI</p>
            </div>
            {/* Featured Product */}
            <div className="section-card bg-gradient-to-br from-cyan/5 to-transparent border-cyan/30">
              <h3 className="text-xl font-semibold text-white">Featured Product</h3>
              <div className="mt-3 rounded-xl overflow-hidden">
                <img 
                  src={lifeguardPurix2} 
                  alt="LifeGuard PURIX Advanced Water Purifier"
                  className="w-full h-48 object-contain bg-slate-900/50 p-4"
                  loading="lazy"
                />
              </div>
              <p className="mt-3 text-sm text-slate-300">LifeGuard PURIX - 7 Stage Advanced Filtration with Copper Goodness</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

export default Home;