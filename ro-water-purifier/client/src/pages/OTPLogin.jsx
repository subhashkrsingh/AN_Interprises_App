import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout.jsx';
import OTPLogin from '../components/OTPLogin.jsx';

function OTPLoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOtpSent = (mobile) => {
    sessionStorage.setItem('otp_mobile', mobile);
    navigate('/verify-otp');
  };

  return (
    <AuthLayout
      title="Secure mobile login"
      description="Use your registered Indian mobile number to receive a one-time password and sign in instantly."
      aside={
        <div className="space-y-2 rounded-3xl border border-slate-700/70 bg-slate-950/60 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Mobile OTP login</p>
          <p>OTP codes expire quickly for security. Avoid sharing the code with anyone.</p>
        </div>
      }>
      <div className="space-y-6">
        <OTPLogin onOtpSent={handleOtpSent} setError={setError} setLoading={setLoading} />
        {error && <p className="rounded-3xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
      </div>
    </AuthLayout>
  );
}

export default OTPLoginPage;
