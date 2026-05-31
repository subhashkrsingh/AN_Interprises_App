import { useState } from 'react';
import { motion } from 'framer-motion';

function FAQAccordion({ items }) {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="section-card overflow-hidden">
          <button
            type="button"
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="flex w-full items-center justify-between text-left text-white">
            <span className="font-semibold">{item.question}</span>
            <span>{openId === item.id ? '−' : '+'}</span>
          </button>
          {openId === item.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 text-slate-300"
            >
              {item.answer}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FAQAccordion;
