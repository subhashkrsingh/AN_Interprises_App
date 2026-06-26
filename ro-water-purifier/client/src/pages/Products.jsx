import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getProducts } from '../api/index.js';
import Loader from '../components/Loader.jsx';
import WhatsAppButton from '../components/WhatsAppButton.jsx';
import useDocumentTitle from '../hooks/useDocumentTitle.jsx';
import {
  lifeguardRo,
  lifeguardBooster,
  lifeguardMax,
  lifeguardPurix1,
  lifeguardPurix2,
  lifeguardPurixCopper,
} from '../assets/images/index.js';

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
  'RO Water Purifier Premium': lifeguardPurix2,
  'RO Water Purifier Copper': lifeguardPurixCopper,
};

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
          {products.map((product, index) => {
            const productImage = productImages[product.name] || 
              (index % 4 === 0 ? lifeguardRo : 
               index % 4 === 1 ? lifeguardBooster : 
               index % 4 === 2 ? lifeguardMax : 
               lifeguardPurix1);
            
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
                className="section-card overflow-hidden hover:border-cyan/50 transition-colors"
              >
                <div className="overflow-hidden rounded-2xl bg-slate-800/50 h-64 flex items-center justify-center">
                  <img 
                    src={product.image || productImage} 
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition duration-500 hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-flex rounded-full bg-cyan/10 px-3 py-2 text-sm font-semibold text-cyan">
                    {product.category || 'RO System'}
                  </span>
                  {product.stage && (
                    <span className="text-sm text-slate-400">{product.stage} Stage</span>
                  )}
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white">{product.name}</h2>
                <p className="mt-3 text-slate-300">{product.description}</p>
                {product.features && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.features.split(',').map((feature, i) => (
                      <span key={i} className="text-xs bg-slate-800/50 px-2 py-1 rounded-full text-slate-300">
                        {feature.trim()}
                      </span>
                    ))}
                  </div>
                )}
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