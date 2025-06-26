import axios from 'axios';
import type { NewsApiArticle } from '@/types';

const NEWS_API_KEY = process.env.NEWS_API_KEY;
const NEWS_API_URL = 'https://newsapi.org/v2/top-headlines';

class NewsAPI {
  async getTopHeadlines(category: string, count: number = 1): Promise<NewsApiArticle[]> {
    if (!NEWS_API_KEY || NEWS_API_KEY === '07c848ead73b4499a49c1d7b8361b275_placeholder') { // A common placeholder from prompts
      console.error('NewsAPI key is not set or is a placeholder.');
      // Return a dummy article for development without a key
      return [{
        title: `This is a sample title for ${category}`,
        description: `This is a sample description for an article about ${category}. In a real scenario, this would be fetched from a live news source.`,
        source: { id: null, name: 'Dummy News' },
        author: 'Dev Author',
        url: '#',
        urlToImage: null,
        publishedAt: new Date().toISOString(),
        content: 'This is sample content.'
      }];
    }
    try {
      const response = await axios.get<{ articles: NewsApiArticle[] }>(NEWS_API_URL, {
        params: {
          apiKey: NEWS_API_KEY,
          category: category,
          pageSize: count,
          country: 'us',
        },
      });
      return response.data.articles;
    } catch (error) {
      if(axios.isAxiosError(error) && error.response?.data?.code === 'apiKeyInvalid') {
        console.error('Invalid NewsAPI key.');
      } else {
        console.error('Error fetching from NewsAPI:', error);
      }
      return [];
    }
  }
}

export const newsAPI = new NewsAPI();
