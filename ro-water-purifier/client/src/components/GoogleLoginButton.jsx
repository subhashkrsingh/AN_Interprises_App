import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';

function GoogleLoginButton({ setLoading, setError, onSuccess }) {
  const login = useGoogleLogin({
    onSuccess: (response) => {
      // Mock success response
      onSuccess({
        name: 'Google User',
        email: 'google@example.com',
        picture: '',
      });
    },
    onError: (error) => {
      console.error('Google login error:', error);
      setError?.('Google login failed. Please try again.');
    },
  });

  return (
    <button
      type="button"
      onClick={() => login()}
      className="flex w-full items-center justify-center gap-3 rounded-3xl border border-slate-700/80 bg-slate-900/90 px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-slate-800/80 hover:border-cyan/50"
    >
      <FcGoogle className="h-5 w-5" />
      <span>Continue with Google</span>
    </button>
  );
}

export default GoogleLoginButton;