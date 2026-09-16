"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = exports.getAllPosts = void 0;
const zod_1 = require("zod");
const apiError_1 = require("../errors/apiError");
const postService = __importStar(require("../services/postService"));
const postSchema = zod_1.z.object({
    title: zod_1.z.string().min(3).max(120),
    body: zod_1.z.string().min(5).max(1000)
});
const validatePost = (data) => postSchema.parse(data);
const getAllPosts = (req, res) => {
    const search = String(req.query.search ?? '').trim().toLowerCase();
    const result = postService.listPosts().filter((post) => !search || post.title.toLowerCase().includes(search) || post.body.toLowerCase().includes(search));
    res.json(result);
};
exports.getAllPosts = getAllPosts;
const createPost = (req, res, next) => {
    try {
        const payload = validatePost(req.body);
        const post = postService.createPostRecord(payload);
        res.status(201).json(post);
    }
    catch (error) {
        next(error);
    }
};
exports.createPost = createPost;
const updatePost = (req, res, next) => {
    try {
        const { id } = req.params;
        if (!postService.getPostById(id)) {
            throw new apiError_1.ApiError(404, 'Post not found');
        }
        const payload = validatePost(req.body);
        const updated = postService.updatePostRecord(id, payload);
        res.json(updated);
    }
    catch (error) {
        next(error);
    }
};
exports.updatePost = updatePost;
const deletePost = (req, res, next) => {
    try {
        const { id } = req.params;
        if (!postService.deletePostRecord(id)) {
            throw new apiError_1.ApiError(404, 'Post not found');
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
};
exports.deletePost = deletePost;
