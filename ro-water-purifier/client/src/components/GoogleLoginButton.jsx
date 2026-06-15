import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import authService from '../services/authService.js';

function GoogleLoginButton({ onSuccess, setError, setLoading }) {
  const handleGoogleSuccess = async (tokenResponse) => {
    if (setLoading) setLoading(true);
    if (setError) setError('');
    try {
      // The tokenResponse.credential contains the ID token
      const data = await authService.googleLogin({ credential: tokenResponse.credential });
      if (onSuccess) onSuccess(data);
    } catch (error) {
      const message = error?.response?.data?.message || 'Google login failed.';
      if (setError) setError(message);
      console.error('Google login error:', error);
    } finally {
      if (setLoading) setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      if (setError) setError('Google sign-in was cancelled or failed.');
    },
    flow: 'implicit',
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
