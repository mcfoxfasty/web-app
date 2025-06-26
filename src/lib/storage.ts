import type { Article } from '@/types';
import fs from 'fs/promises';
import path from 'path';

class StorageManager {
  private jsonFilePath: string;
  private useVercelKV: boolean = false;
  private kv: any = null;
  private initializationPromise: Promise<void> | null = null;

  constructor() {
    this.jsonFilePath = path.join(process.cwd(), 'data', 'articles.json');
    this.initializationPromise = this.initializeStorage();
  }

  private async initializeStorage() {
    try {
      if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        try {
          const { kv } = await import('@vercel/kv');
          this.kv = kv;
          this.useVercelKV = true;
          console.log('Using Vercel KV storage');
        } catch (error) {
          console.log('Vercel KV not available, falling back to JSON storage');
          this.useVercelKV = false;
        }
      } else {
        console.log('Using JSON file storage (development mode)');
        this.useVercelKV = false;
      }
      
      if (!this.useVercelKV) {
        await this.ensureJsonFileExists();
      }
    } catch (error) {
      console.error('Storage initialization error:', error);
      this.useVercelKV = false;
      await this.ensureJsonFileExists();
    }
  }

  private async ensureReady() {
    if (this.initializationPromise) {
      await this.initializationPromise;
    }
  }

  private async ensureJsonFileExists() {
    try {
      await fs.access(this.jsonFilePath);
    } catch {
      const dataDir = path.dirname(this.jsonFilePath);
      await fs.mkdir(dataDir, { recursive: true });
      await fs.writeFile(this.jsonFilePath, JSON.stringify([], null, 2));
    }
  }

  async saveArticle(article: Article): Promise<Article> {
    await this.ensureReady();
    if (this.useVercelKV && this.kv) {
      try {
        await this.kv.set(`article:${article.slug}`, JSON.stringify(article));
        
        let existingIds: string[] = (await this.kv.get('article_ids')) || [];
        if (!existingIds.includes(article.slug)) {
          existingIds.unshift(article.slug);
          await this.kv.set('article_ids', existingIds);
        }
        
        return article;
      } catch (error) {
        console.error('KV storage error:', error);
        return this.saveToJson(article);
      }
    } else {
      return this.saveToJson(article);
    }
  }

  private async saveToJson(article: Article): Promise<Article> {
    const articles = await this.getAllArticlesFromJson();
    const filteredArticles = articles.filter(a => a.slug !== article.slug);
    filteredArticles.unshift(article);
    await fs.writeFile(this.jsonFilePath, JSON.stringify(filteredArticles, null, 2));
    return article;
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    await this.ensureReady();
    if (this.useVercelKV && this.kv) {
      try {
        const articleData: string | null = await this.kv.get(`article:${slug}`);
        if (articleData) {
          return JSON.parse(articleData);
        }
        return null;
      } catch (error) {
        console.error('KV retrieval error:', error);
        return this.getArticleFromJson(slug);
      }
    } else {
      return this.getArticleFromJson(slug);
    }
  }

  private async getArticleFromJson(slug: string): Promise<Article | null> {
    const articles = await this.getAllArticlesFromJson();
    return articles.find(article => article.slug === slug) || null;
  }

  async getArticlesByCategory(category: string, limit: number = 10): Promise<Article[]> {
    await this.ensureReady();
    if (this.useVercelKV && this.kv) {
      try {
        const articleIds: string[] = (await this.kv.get('article_ids')) || [];
        const articles: Article[] = [];
        
        for (const id of articleIds) {
          if (articles.length >= limit) break;
          const articleData: string | null = await this.kv.get(`article:${id}`);
          if (articleData) {
            const article = JSON.parse(articleData);
            if (article.category === category && article.published) {
              articles.push(article);
            }
          }
        }
        
        return articles;
      } catch (error) {
        console.error('KV category retrieval error:', error);
        return this.getCategoryFromJson(category, limit);
      }
    } else {
      return this.getCategoryFromJson(category, limit);
    }
  }

  private async getCategoryFromJson(category: string, limit: number): Promise<Article[]> {
    const articles = await this.getAllArticlesFromJson();
    return articles
      .filter(article => article.category === category && article.published)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getAllArticles(): Promise<Article[]> {
    await this.ensureReady();
    if (this.useVercelKV && this.kv) {
      try {
        const articleIds: string[] = (await this.kv.get('article_ids')) || [];
        if (!articleIds) return [];
        const multiGet = this.kv.mget(...articleIds.map(id => `article:${id}`));
        const articlesData: (Article | null)[] = await multiGet;
        
        const articles = articlesData.filter((article): article is Article => article !== null);

        return articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      } catch (error) {
        console.error('KV all articles retrieval error:', error);
        return this.getAllArticlesFromJson();
      }
    } else {
      return this.getAllArticlesFromJson();
    }
  }

  private async getAllArticlesFromJson(): Promise<Article[]> {
    try {
      await this.ensureJsonFileExists();
      const data = await fs.readFile(this.jsonFilePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }
}

export const storage = new StorageManager();
