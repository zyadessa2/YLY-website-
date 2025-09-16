"use client";

import { useState, useEffect } from "react";
import { CommentsService, NewsComment } from "@/lib/database";
import Link from "next/link";
import { motion } from "framer-motion";

interface CommentWithNews extends NewsComment {
  news: {
    title: string;
  };
}

export default function CommentsManagement() {
  const [comments, setComments] = useState<CommentWithNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const fetchedComments = await CommentsService.getAllCommentsForAdmin();
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await CommentsService.approveComment(id);
      setComments((prev) =>
        prev.map((comment) =>
          comment.id === id ? { ...comment, approved: true } : comment
        )
      );
      setMessage({ text: "Comment approved successfully!", type: "success" });
    } catch (error) {
      console.error("Error approving comment:", error);
      setMessage({ text: "Failed to approve comment", type: "error" });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await CommentsService.rejectComment(id);
      setComments((prev) => prev.filter((comment) => comment.id !== id));
      setMessage({ text: "Comment deleted successfully!", type: "success" });
    } catch (error) {
      console.error("Error deleting comment:", error);
      setMessage({ text: "Failed to delete comment", type: "error" });
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Comments Management</h1>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={`mb-4 rounded-md p-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-md bg-gray-50 p-8 text-center">
          <p className="text-lg text-gray-500">No comments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Author
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  News Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Comment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {comments.map((comment) => (
                <tr key={comment.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {comment.author_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {comment.author_email}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {comment.news?.title ? (
                      <Link
                        href={`/news/${comment.news_id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        {comment.news.title}
                      </Link>
                    ) : (
                      "Unknown Article"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="max-w-xs truncate text-sm text-gray-900">
                      {comment.content}
                    </p>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        comment.approved
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {comment.approved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    {!comment.approved && (
                      <button
                        onClick={() => handleApprove(comment.id)}
                        className="mr-2 text-green-600 hover:text-green-900"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
