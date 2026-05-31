function Toast({ type = 'success', message }) {
  return (
    <div className={`toast ${type === 'error' ? 'bg-red-500 text-white' : 'bg-cyan text-navy'}`}>
      {message}
    </div>
  );
}

export default Toast;
