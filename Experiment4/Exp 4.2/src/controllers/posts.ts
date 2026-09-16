import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from '../errors/apiError';
import * as postService from '../services/postService';

const postSchema = z.object({
  title: z.string().min(3).max(120),
  body: z.string().min(5).max(1000)
});

const validatePost = (data: unknown) => postSchema.parse(data);

export const getAllPosts = (req: Request, res: Response) => {
  const search = String(req.query.search ?? '').trim().toLowerCase();
  const result = postService.listPosts().filter((post: { title: string; body: string }) =>
    !search || post.title.toLowerCase().includes(search) || post.body.toLowerCase().includes(search)
  );
  res.json(result);
};

export const createPost = (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = validatePost(req.body);
    const post = postService.createPostRecord(payload);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const updatePost = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!postService.getPostById(id)) {
      throw new ApiError(404, 'Post not found');
    }
    const payload = validatePost(req.body);
    const updated = postService.updatePostRecord(id, payload);
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

export const deletePost = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    if (!postService.deletePostRecord(id)) {
      throw new ApiError(404, 'Post not found');
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
