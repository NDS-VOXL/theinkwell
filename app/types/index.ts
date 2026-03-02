// app/types/index.ts
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
  dislikesCount: number; // 🟢 ADD THIS
  commentsCount: number;
  createdAt: Timestamp;
  likes: string[];      // 🟢 Array of user UIDs
  dislikes: string[];   // 🟢 ADD THIS
}

export interface ArticleComment {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: Timestamp;
}