import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import type { Article } from '@/types';

type NewArticle = Omit<Article, 'id' | 'createdAt' | 'updatedAt'>;
type UpdateArticle = Partial<Omit<Article, 'id' | 'createdAt' | 'updatedAt' | 'author' | 'sourceHeadline'>>;

const getArticlesCollection = () => collection(getDb(), 'articles');

function fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Article {
  const data = snapshot.data();
  return {
    id: snapshot.id,
    ...data,
    createdAt: (data.createdAt as Timestamp).toDate().toISOString(),
    updatedAt: (data.updatedAt as Timestamp).toDate().toISOString(),
  } as Article;
}

class StorageManager {
  async saveArticle(articleData: NewArticle): Promise<Article> {
    const now = new Date();
    const docRef = await addDoc(getArticlesCollection(), {
      ...articleData,
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    
    const savedDoc = await getDoc(docRef);
    return fromFirestore(savedDoc as QueryDocumentSnapshot<DocumentData>);
  }

  async updateArticle(id: string, articleData: UpdateArticle): Promise<void> {
    const docRef = doc(getDb(), 'articles', id);
    await updateDoc(docRef, {
      ...articleData,
      updatedAt: Timestamp.fromDate(new Date()),
    });
  }

  async deleteArticle(id: string): Promise<void> {
    const docRef = doc(getDb(), 'articles', id);
    await deleteDoc(docRef);
  }

  async getArticleById(id: string): Promise<Article | null> {
    const docRef = doc(getDb(), 'articles', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return null;
    }
    return fromFirestore(docSnap as QueryDocumentSnapshot<DocumentData>);
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    const q = query(getArticlesCollection(), where('slug', '==', slug), limit(1));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return null;
    }
    return fromFirestore(querySnapshot.docs[0]);
  }

  async getArticlesByCategory(category: string, count: number = 10): Promise<Article[]> {
    const q = query(
      getArticlesCollection(),
      where('category', '==', category),
      where('published', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  }

  async getAllArticles(includeUnpublished = false, count = 50): Promise<Article[]> {
    let q;
    if (includeUnpublished) {
        q = query(getArticlesCollection(), orderBy('createdAt', 'desc'), limit(count));
    } else {
        q = query(getArticlesCollection(), where('published', '==', true), orderBy('createdAt', 'desc'), limit(count));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(fromFirestore);
  }

  async isDuplicateHeadline(headline: string): Promise<boolean> {
    const q = query(getArticlesCollection(), where('sourceHeadline', '==', headline), limit(1));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }
}

export const storage = new StorageManager();
