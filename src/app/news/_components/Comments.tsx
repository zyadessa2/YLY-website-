"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
}

interface CommentsProps {
  newsId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const Comments = ({ newsId }: CommentsProps) => {
  const [comments, setComments] = useState<Comment[]>([]); // In a real app, fetch from API
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName,
      content: newComment,
      date: new Date().toLocaleDateString(),
    };

    setComments((prev) => [comment, ...prev]);
    setNewComment("");
  };

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold">Comments</h2>
        {/* Comment Form */}{" "}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-lg bg-card p-6 shadow-lg"
          onSubmit={handleSubmit}
        >
          <div className="mb-6 space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name"
                className="peer w-full rounded-md border border-gray-300 bg-background p-3 pl-4 text-sm outline-none transition-all focus:border-primary"
                required
              />
              <motion.span
                className="absolute left-4 top-0 -translate-y-1/2 bg-background px-2 text-xs text-gray-500 opacity-0 transition-all peer-focus:opacity-100"
                animate={{ opacity: authorName ? 1 : 0 }}
              >
                Your Name
              </motion.span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="peer w-full rounded-md border border-gray-300 bg-background p-3 pl-4 text-sm outline-none transition-all focus:border-primary"
                rows={4}
                required
              />
              <motion.span
                className="absolute left-4 top-0 -translate-y-1/2 bg-background px-2 text-xs text-gray-500 opacity-0 transition-all peer-focus:opacity-100"
                animate={{ opacity: newComment ? 1 : 0 }}
              >
                Your Comment
              </motion.span>
            </motion.div>
          </div>
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative overflow-hidden rounded-md bg-primary px-6 py-3 text-white transition-all hover:shadow-lg"
          >
            <span className="relative z-10">Post Comment</span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ type: "tween" }}
              style={{ mixBlendMode: "overlay" }}
            />
          </motion.button>
        </motion.form>
        {/* Comments List */}
        <div className="space-y-4">
          {" "}
          {comments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="rounded-lg bg-card p-4 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="mb-2 flex items-center justify-between">
                <motion.span
                  className="font-semibold"
                  whileHover={{ color: "var(--primary)" }}
                >
                  {comment.author}
                </motion.span>
                <span className="text-sm text-gray-500">{comment.date}</span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </motion.div>
          ))}
          {comments.length === 0 && (
            <p className="text-center text-gray-500">
              No comments yet. Be the first to comment!
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
