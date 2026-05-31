import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Products from './pages/Products.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import WhatsAppButton from './components/WhatsAppButton.jsx';

function App() {
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER;
  const supportMessage = 'Hello Support Team, I need assistance regarding my account/order.';

  return (
    <div className="relative min-h-screen bg-navy text-slate-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
      <WhatsAppButton
        phoneNumber={whatsappNumber}
        message={supportMessage}
        type="support"
        isFloating
      />
    </div>
  );
}

export default App;
