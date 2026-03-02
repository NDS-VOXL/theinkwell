import { Timestamp } from "firebase/firestore";

export interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  categories: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  readTime: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Timestamp;
  likes: string[]; // Array of user UIDs who liked
}

export interface ArticleComment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Timestamp;
}