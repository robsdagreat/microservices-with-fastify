import { v4 as uuidv4 } from 'uuid';

export interface IPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

export class Post implements IPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;

  constructor(title: string, content: string, author: string) {
    this.id = uuidv4();
    this.title = title;
    this.content = content;
    this.author = author;
    this.createdAt = new Date();
  }
}