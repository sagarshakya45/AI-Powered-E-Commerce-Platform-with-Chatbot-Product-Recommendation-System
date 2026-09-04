import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, MessageSquare, Send, Sparkles, PlusCircle, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../../../services/apiClient';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Button } from '../../../components/ui/Button';

export const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId],
    queryFn: async () => {
      const res = await apiClient.get(`/reviews?productId=${productId}`);
      return res.data?.data;
    },
  });

  const { data: aiSummary, isLoading: isSummaryLoading, refetch: getSummary } = useQuery({
    queryKey: ['ai-summary', productId],
    queryFn: async () => {
      const res = await apiClient.post('/ai/summarize-reviews', { productId });
      return res.data?.data?.summary;
    },
    enabled: false,
  });

  const submitReview = useMutation({
    mutationFn: async (payload: { productId: string; rating: number; comment: string }) => {
      const res = await apiClient.post('/reviews', payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      setComment('');
      setRating(5);
      setErrorMsg('');
      setSuccessMsg('Review submitted successfully! Thank you.');
      setTimeout(() => {
        setSuccessMsg('');
        setModalOpen(false);
      }, 1800);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.message || 'Failed to submit review');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setErrorMsg('You must be logged in to leave a review.');
      return;
    }
    submitReview.mutate({ productId, rating, comment });
  };

  const reviews = data?.reviews || [];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 mt-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-violet-600" />
            Verified Customer Reviews
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Real feedback from verified purchasers</p>
        </div>

        <div className="flex items-center gap-2">
          {reviews.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
              onClick={() => getSummary()}
              isLoading={isSummaryLoading}
              className="rounded-full border-amber-200 text-amber-900 hover:bg-amber-50"
            >
              AI Insights
            </Button>
          )}

          <Button
            size="sm"
            leftIcon={<PlusCircle className="w-4 h-4" />}
            onClick={() => setModalOpen(true)}
            className="rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold"
          >
            Write a Review
          </Button>
        </div>
      </div>

      {/* AI Summary Box */}
      {aiSummary && (
        <div className="bg-gradient-to-r from-violet-50 via-indigo-50 to-pink-50 border border-violet-200/60 p-6 rounded-3xl relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-violet-500 to-indigo-600" />
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-2 text-sm">
            <Sparkles className="w-4 h-4 text-violet-600" />
            AI Sentiment & Review Summary
          </h3>
          <p className="text-slate-700 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-medium">{aiSummary}</p>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-24 bg-slate-100 rounded-2xl" />
            ))}
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-12 bg-slate-50/80 rounded-3xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center mx-auto">
              <Star className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No reviews yet for this product</p>
            <p className="text-xs text-slate-500">Be the first customer to leave your rating and feedback!</p>
            <Button
              size="sm"
              onClick={() => setModalOpen(true)}
              className="mt-2 rounded-full bg-violet-600 hover:bg-violet-700"
            >
              Write First Review
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r: any) => (
              <div key={r.id} className="p-5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-md">
                      {r.user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{r.user?.name || 'Customer'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 bg-amber-50 border border-amber-200/60 px-2 py-1 rounded-full">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-slate-700 text-xs leading-relaxed font-medium">{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Glassmorphic Write Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in-50">
          <div className="relative w-full max-w-lg bg-slate-950/95 border border-violet-500/30 text-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                Submit Product Review
              </h3>
              <p className="text-xs text-slate-400">Share your honest feedback to help other buyers</p>
            </div>

            {successMsg ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-4 rounded-2xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
                <span className="text-xs font-bold">{successMsg}</span>
              </div>
            ) : !user ? (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl text-center space-y-3">
                <p className="text-xs text-slate-300 font-medium">Please sign in to post your review on AuraMart.</p>
                <Link
                  to="/login"
                  className="inline-block text-xs font-bold px-5 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-md"
                >
                  Sign In Now
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs p-3 rounded-2xl font-medium">
                    {errorMsg}
                  </div>
                )}

                {/* Rating Selection */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Select Rating ({hoverRating || rating} / 5 Stars)
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 text-slate-600 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= (hoverRating || rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Textarea */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Your Review Comment
                  </label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved or how we can improve..."
                    required
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-violet-500 transition-colors resize-none"
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="flex-1 py-3 text-xs font-bold text-slate-400 bg-slate-900 hover:bg-slate-800 rounded-full border border-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitReview.isPending}
                    className="flex-1 py-3 text-xs font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-full shadow-lg shadow-violet-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
