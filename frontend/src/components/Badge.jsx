export const Badge = ({ label, color = 'blue' }) => {
  const variants = {
    blue: 'bg-blue-900/50 text-blue-300 border-blue-700',
    green: 'bg-emerald-900/50 text-emerald-300 border-emerald-700',
    red: 'bg-red-900/50 text-red-300 border-red-700',
    yellow: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
    purple: 'bg-violet-900/50 text-violet-300 border-violet-700'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[color]}`}>
      {label}
    </span>
  );
};
