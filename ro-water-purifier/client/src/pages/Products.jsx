import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '../api/index.js';
import Loader from '../components/Loader.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.js';

function Products() {
  useDocumentTitle('Products | Best RO Water Purifier Sales & Service Provider');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        setProducts(data);
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
        <p className="text-cyan font-semibold uppercase tracking-[0.3em]">Our Products</p>
        <h1 className="section-title mt-4">RO Systems Designed for Every Need</h1>
        <p className="section-subtitle mx-auto mt-4">
          Browse domestic, commercial and smart RO products built for dependable water purification.
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => {
            const orderMessage = `Hello, I want to order:
Product: ${product.name}
ID: ${product.id}
Price: ${product.price ?? 'Contact for price'}
Quantity: ${product.quantity ?? 1}`;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="section-card"
              >
                <span className="inline-flex rounded-full bg-cyan/10 px-3 py-2 text-sm font-semibold text-cyan">
                  {product.category}
                </span>
                <h2 className="mt-5 text-2xl font-semibold text-white">{product.name}</h2>
                <p className="mt-3 text-slate-300">{product.description}</p>
                <p className="mt-4 text-slate-200">
                  <span className="font-semibold text-white">Price:</span> {product.price ?? 'Contact for price'}
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

export default Products;
