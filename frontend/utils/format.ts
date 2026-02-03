export const formatDateTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

export const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

export const formatShortId = (value: string, prefix = 'case') => {
  if (!value) return '—';
  const trimmed = value.replace(/-/g, '');
  return `${prefix}_${trimmed.slice(-6)}`;
};

export const formatRole = (role?: string) => {
  if (!role) return '—';
  return role.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

export const redactText = (value: string) => {
  const phonePattern = /\b\+?\d[\d\s().-]{7,}\b/g;
  const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
  return value.replace(phonePattern, '[redacted]').replace(emailPattern, '[redacted]');
};
