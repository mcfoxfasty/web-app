export type Article = {
  id: string;
  title: string;
  slug: string;
  category: string;
  content: string; // HTML content
  metaDescription: string;
  coverImage: string;
  author: 'AI';
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
