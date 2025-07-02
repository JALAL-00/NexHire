// frontend/src/lib/utils.ts

/**
 * Generates initials from a user's full name.
 * @param name - The full name of the user (e.g., "John Doe").
 * @returns A string of initials (e.g., "JD") or an empty string if no name is provided.
 */
export const getInitials = (name: string | null | undefined): string => {
  if (!name) return '';

  const names = name.trim().split(' ');
  
  if (names.length === 1 && names[0] !== '') {
    return names[0][0].toUpperCase();
  }
  
  const initials = names
    .map(n => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('');
    
  return initials.toUpperCase();
};

/**
 * Calculates the number of days remaining until an expiration date.
 * @param expirationDateStr - A date string (e.g., from the database).
 * @returns A user-friendly string like "Expires today", "X days left", or "Expired".
 */
export const calculateDaysRemaining = (expirationDateStr: string | null | undefined): string => {
  if (!expirationDateStr) {
    return 'No expiration date';
  }

  const expirationDate = new Date(expirationDateStr);
  const today = new Date();

  // Reset time to 00:00:00 to compare dates only
  today.setHours(0, 0, 0, 0);

  // Check if the expiration date from the DB is valid
  if (isNaN(expirationDate.getTime())) {
    return 'Invalid date';
  }

  const diffTime = expirationDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return 'Expired';
  }
  if (diffDays === 0) {
    return 'Expires today';
  }
  if (diffDays === 1) {
    return '1 day left';
  }
  return `${diffDays} days left`;
};