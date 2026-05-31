import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { FcGoogle } from 'react-icons/fc';
import authService from '../services/authService.js';

function GoogleLoginButton({ onSuccess, setError, setLoading }) {
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.post('/api/auth/google', { credential: tokenResponse.credential }, { withCredentials: true });
        onSuccess(response.data);
      } catch (error) {
        setError(error?.response?.data?.message || 'Google login failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google sign-in was cancelled or failed.'),
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="inline-flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800">
      <FcGoogle size={20} />
      Sign in with Google
    </button>
  );
}

export default GoogleLoginButton;
