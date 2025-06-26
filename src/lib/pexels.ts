import axios from 'axios';

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = 'https://api.pexels.com/v1/search';

type PexelsImage = {
  src: {
    large: string;
    original: string;
  };
};

class PexelsAPI {
  async searchImages(query: string, count: number = 1): Promise<PexelsImage[]> {
    if (!PEXELS_API_KEY || PEXELS_API_KEY === 'your_pexels_key_here') {
      console.warn('Pexels API key is not set. Will use placeholder images.');
      return [];
    }
    try {
      const response = await axios.get<{ photos: PexelsImage[] }>(PEXELS_API_URL, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
        params: {
          query: query,
          per_page: count,
        },
      });
      return response.data.photos;
    } catch (error) {
      console.error('Error fetching from Pexels API:', error);
      return [];
    }
  }
}

export const pexelsAPI = new PexelsAPI();
