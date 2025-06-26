export type Article = {
  id: string;
  title: string;
  slug: string;
  sourceHeadline: string; // The original headline from the news source for deduplication
  category: string;
  content: string; // HTML content
  metaDescription: string;
  coverImage: string;
  author: 'AI News';
  affiliateLink: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  published: boolean;
};

export type NewsApiArticle = {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
};
