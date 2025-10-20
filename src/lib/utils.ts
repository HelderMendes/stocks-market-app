import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind + other class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format time ago (e.g., "2 hours ago")
export const formatTimeAgo = (timestamp: number) => {
  const now = Date.now();
  const diffInMs = now - timestamp * 1000; // Assume input in seconds
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInHours > 24) {
    const days = Math.floor(diffInHours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInHours >= 1) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
};

// Delay utility
export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Format market cap for display (e.g., "$1.23T")
export function formatMarketCapValue(marketCap: number): string {
  if (!Number.isFinite(marketCap) || marketCap <= 0) return 'N/A';

  if (marketCap >= 1e12) return `€${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `€${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `€${(marketCap / 1e6).toFixed(2)}M`;
  return `€${marketCap.toFixed(2)}`;
}

// Get a date range from X days ago to today (YYYY-MM-DD)
export const getDateRange = (days: number) => {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - days);
  return {
    to: toDate.toISOString().split('T')[0],
    from: fromDate.toISOString().split('T')[0],
  };
};

// Get today's range (YYYY-MM-DD)
export const getTodayDateRange = () => {
  const today = new Date();
  const d = today.toISOString().split('T')[0];
  return { to: d, from: d };
};

// Calculate news distribution over symbols
export const calculateNewsDistribution = (symbolsCount: number) => {
  let itemsPerSymbol;
  let targetNewsCount = 6;

  if (symbolsCount < 3) {
    itemsPerSymbol = 3;
  } else if (symbolsCount === 3) {
    itemsPerSymbol = 2;
  } else {
    itemsPerSymbol = 1;
    targetNewsCount = 6;
  }

  return { itemsPerSymbol, targetNewsCount };
};

// Validate news article shape
export const validateArticle = (article: RawNewsArticle) =>
  article.headline && article.summary && article.url && article.datetime;

// Today's date as "YYYY-MM-DD"
export const getTodayString = () => new Date().toISOString().split('T')[0];

// Format an article object for display
export const formatArticle = (
  article: RawNewsArticle,
  isCompanyNews: boolean,
  symbol?: string,
  index: number = 0
) => ({
  id: isCompanyNews ? Date.now() + Math.random() : article.id + index,
  headline: article.headline!.trim(),
  summary:
    article.summary!.trim().substring(0, isCompanyNews ? 200 : 150) + '...',
  source: article.source || (isCompanyNews ? 'Company News' : 'Market News'),
  url: article.url!,
  datetime: article.datetime!,
  image: article.image || '',
  category: isCompanyNews ? 'company' : article.category || 'general',
  related: isCompanyNews ? symbol! : article.related || '',
});

// Format a change percent (e.g., "+1.23%")
export const formatChangePercent = (changePercent?: number) => {
  if (!changePercent) return '';
  const sign = changePercent > 0 ? '+' : '';
  return `${sign}${changePercent.toFixed(2)}%`;
};

// Get color class for a price change
export const getChangeColorClass = (changePercent?: number) => {
  if (!changePercent) return 'text-gray-400';
  return changePercent > 0 ? 'text-green-500' : 'text-red-500';
};

// Format a price (Euro, Netherlands English formatting, two decimals)
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(price);
};

// Today's date, long format string (Netherlands, but English)
export const formatDateToday = new Date().toLocaleDateString('en-NL', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'Europe/Amsterdam',
});

// Format price alert
export const getAlertText = (alert: Alert) => {
  const condition = alert.alertType === 'upper' ? '>' : '<';
  return `Price ${condition} ${formatPrice(alert.threshold)}`;
};

// Long format for today's date (Netherlands, English)
export const getFormattedTodayDate = () =>
  new Date().toLocaleDateString('en-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Europe/Amsterdam',
  });
