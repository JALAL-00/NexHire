'use client';

export const AvatarFallback = ({ name, className }: { name?: string; className?: string }) => {
  const initial = (name || 'User').trim().charAt(0).toUpperCase();
  return (
    <div className={`flex items-center justify-center w-full h-full bg-primary text-primary-content ${className}`}>
      <span className="text-xl font-semibold">{initial}</span>
    </div>
  );
};