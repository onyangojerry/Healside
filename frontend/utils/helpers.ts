export function generateCorrelationId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}