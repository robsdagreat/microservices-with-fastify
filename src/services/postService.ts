import fs from 'fs';
import path from 'path';
import { Post, IPost } from '../models/post';

// In-memory storage
let posts: IPost[] = [];

// File path for persistence
const dataFilePath = path.join(__dirname, '../../data/posts.json');

// Ensure data directory exists
const ensureDataDirectory = (): void => {
  const dataDir = path.dirname(dataFilePath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// Load posts from file
const loadPosts = (): void => {
  ensureDataDirectory();
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      posts = JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading posts:', error);
    // If file doesn't exist or has invalid JSON, we'll start with empty posts
    posts = [];
  }
};

// Save posts to file
const savePosts = (): void => {
  ensureDataDirectory();
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(posts, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving posts:', error);
  }
};

// Initialize by loading posts
loadPosts();

export const postService = {
  getAllPosts: (): IPost[] => {
    return [...posts];
  },

  getPostById: (id: string): IPost | undefined => {
    return posts.find(post => post.id === id);
  },

  createPost: (title: string, content: string, author: string): IPost => {
    const post = new Post(title, content, author);
    posts.push(post);
    savePosts();
    return post;
  },
  
  clearAllPosts: (): void => {
    // Clear all posts
    posts = [];
    savePosts();
  }
};