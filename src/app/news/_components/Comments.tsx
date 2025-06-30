"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CommentsService,
  NewsComment,
  CreateNewsCommentData,
} from "@/lib/database";

interface CommentsProps {
  newsId: string;
}

export const Comments = ({ newsId }: CommentsProps) => {
  const [comments, setComments] = useState<NewsComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await CommentsService.getCommentsByNewsId(
          newsId
        );
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [newsId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim() || !authorEmail.trim()) return;

    try {
      setIsSubmitting(true);
      const commentData: CreateNewsCommentData = {
        news_id: newsId,
        author_name: authorName,
        author_email: authorEmail,
        content: newComment,
      };

      await CommentsService.createComment(commentData);
      setSubmitMessage({
        text: "Comment submitted successfully! It will be visible after approval.",
        type: "success",
      });
      setNewComment("");
      // We don't add the comment to the UI until it's approved
    } catch (error) {
      console.error("Error submitting comment:", error);
      setSubmitMessage({
        text: "Failed to submit comment. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
      // Clear message after 5 seconds
      setTimeout(() => setSubmitMessage(null), 5000);
    }
  };

  return (
    <section className="bg-background py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-3xl font-bold">Comments</h2>

        {/* Comment Form */}
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
              transition={{ delay: 0.25 }}
              className="relative"
            >
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="Your Email"
                className="peer w-full rounded-md border border-gray-300 bg-background p-3 pl-4 text-sm outline-none transition-all focus:border-primary"
                required
              />
              <motion.span
                className="absolute left-4 top-0 -translate-y-1/2 bg-background px-2 text-xs text-gray-500 opacity-0 transition-all peer-focus:opacity-100"
                animate={{ opacity: authorEmail ? 1 : 0 }}
              >
                Your Email
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

          {submitMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-4 p-3 rounded-md ${
                submitMessage.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {submitMessage.text}
            </motion.div>
          )}

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`group relative overflow-hidden rounded-md bg-primary px-6 py-3 text-white transition-all ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg"
            }`}
          >
            <span className="relative z-10">
              {isSubmitting ? "Submitting..." : "Post Comment"}
            </span>
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ x: "100%" }}
              whileHover={{ x: isSubmitting ? "100%" : 0 }}
              transition={{ type: "tween" }}
              style={{ mixBlendMode: "overlay" }}
            />
          </motion.button>
        </motion.form>

        {/* Comments List */}
        <div className="space-y-4">
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
                  {comment.author_name}
                </motion.span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </span>
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
