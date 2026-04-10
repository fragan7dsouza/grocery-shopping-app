export const FALLBACK_PRODUCT_IMAGE =
  'https://images.pexels.com/photos/4198013/pexels-photo-4198013.jpeg?auto=compress&cs=tinysrgb&w=1200';

export function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(Number(value) || 0);
}
