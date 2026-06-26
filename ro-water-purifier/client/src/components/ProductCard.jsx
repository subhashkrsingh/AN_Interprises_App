import { motion } from 'framer-motion';
import WhatsAppButton from './WhatsAppButton.jsx';
import { lifeguardRo } from '../assets/images/index.js';

const productImages = {
  'LifeGuard RO': lifeguardRo,
  'LifeGuard Booster': lifeguardBooster,
  'LifeGuard MAX': lifeguardMax,
  'LifeGuard PURIX': lifeguardPurix1,
  'LifeGuard PURIX Copper': lifeguardPurixCopper,
  'LifeGuard Alkaline': lifeguardPurix2,
};

function ProductCard({ product, index, whatsappNumber }) {
  const productImage = productImages[product.name] || 
    (index % 4 === 0 ? lifeguardRo : 
     index % 4 === 1 ? lifeguardBooster : 
     index % 4 === 2 ? lifeguardMax : 
     lifeguardPurix1);

  const orderMessage = `Hello, I want to order:
Product: ${product.name}
Price: ${product.price ?? 'Contact for price'}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="section-card overflow-hidden hover:border-cyan/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,212,255,0.1)]"
    >
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-800/50 to-slate-900/50 h-64 flex items-center justify-center">
        <img 
          src={product.image || productImage} 
          alt={product.name}
          className="w-full h-full object-contain p-4 transition duration-500 hover:scale-110"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 right-3 bg-cyan/90 text-navy text-xs font-bold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <span className="inline-flex rounded-full bg-cyan/10 px-3 py-2 text-sm font-semibold text-cyan">
          {product.category || 'RO System'}
        </span>
        {product.stage && (
          <span className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1 rounded-full">
            {product.stage} Stage
          </span>
        )}
      </div>
      
      <h2 className="mt-3 text-2xl font-semibold text-white">{product.name}</h2>
      <p className="mt-3 text-slate-300 line-clamp-2">{product.description}</p>
      
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
      
      <div className="mt-6 flex items-center gap-3">
        <WhatsAppButton
          phoneNumber={whatsappNumber}
          message={orderMessage}
          type="order"
        />
        <button className="text-sm text-slate-400 hover:text-cyan transition-colors">
          View Details →
        </button>
      </div>
    </motion.div>
  );
}

export default ProductCard;