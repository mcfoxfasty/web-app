export const CATEGORIES = ['business', 'tech', 'sports', 'politics', 'entertainment'] as const;

export const AFFILIATE_LINKS = {
  business: 'https://example.com/business-tools?ref=ainews',
  tech: 'https://example.com/tech-gadgets?ref=ainews',
  sports: 'https://example.com/sports-gear?ref=ainews',
  politics: 'https://example.com/political-books?ref=ainews',
  entertainment: 'https://example.com/streaming-service?ref=ainews',
};

export const SITE_CONFIG = {
  name: 'NewsAI',
  description: 'Your daily source for AI-curated news across business, finance, technology, sports, and politics.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.jpg',
};

export const FEATURED_CATEGORIES: (typeof CATEGORIES)[number][] = ['tech', 'business', 'sports'];
