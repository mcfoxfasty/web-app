export const CATEGORIES = ['business', 'tech', 'sports', 'politics', 'entertainment'] as const;

export const AFFILIATE_LINKS = {
  business: 'https://example.com/business-tools?ref=newsradar',
  tech: 'https://example.com/tech-gadgets?ref=newsradar',
  sports: 'https://example.com/sports-gear?ref=newsradar',
  politics: 'https://example.com/political-books?ref=newsradar',
  entertainment: 'https://example.com/streaming-service?ref=newsradar',
};

export const SITE_CONFIG = {
  name: 'NewsRadar',
  description: 'Your daily source for curated news across business, finance, technology, sports, and politics.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
};

export const FEATURED_CATEGORIES: (typeof CATEGORIES)[number][] = ['tech', 'business', 'sports'];
