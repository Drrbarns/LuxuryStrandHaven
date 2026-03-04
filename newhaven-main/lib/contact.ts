/**
 * Format phone for WhatsApp wa.me link (digits only, Ghana country code 233 if local).
 */
export function toWhatsAppNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('233')) return digits;
  if (digits.startsWith('0') && digits.length >= 10) return '233' + digits.slice(1);
  if (digits.length >= 9) return '233' + digits;
  return digits;
}
