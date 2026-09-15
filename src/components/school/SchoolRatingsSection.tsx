'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/authContext';
import {
  Star,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  Send,
  User,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  LogIn,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';

interface RatingItem {
  id: string;
  userName: string;
  userChildGrade?: string;
  score: number;
  title?: string;
  comment: string;
  verifiedParent: boolean;
  createdAt: string;
  categories?: {
    academics?: number;
    infrastructure?: number;
    faculty?: number;
    safety?: number;
  };
}

interface RatingSummary {
  averageScore: number;
  totalReviews: number;
  distribution: Record<number, number>;
  categoryAverages: {
    academics: number;
    infrastructure: number;
    faculty: number;
    safety: number;
  };
}

interface SchoolRatingsSectionProps {
  schoolSlug: string;
  schoolName: string;
}

export const SchoolRatingsSection: React.FC<SchoolRatingsSectionProps> = ({
  schoolSlug,
  schoolName,
}) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [summary, setSummary] = useState<RatingSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [score, setScore] = useState(5);
  const [hoverScore, setHoverScore] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [categoryRatings, setCategoryRatings] = useState({
    academics: 5,
    infrastructure: 5,
    faculty: 5,
    safety: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Load existing ratings and log view
  useEffect(() => {
    let mounted = true;

    async function loadRatings() {
      try {
        const res = await fetch(`/api/schools/${schoolSlug}/ratings`);
        if (res.ok) {
          const data = await res.json();
          if (mounted && data.success) {
            setRatings(data.ratings || []);
            setSummary(data.summary || null);
          }
        }
      } catch (err) {
        console.error('Failed to load ratings:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    loadRatings();

    // Fire view tracking
    fetch(`/api/schools/${schoolSlug}/view`, { method: 'POST' }).catch(() => {});

    return () => {
      mounted = false;
    };
  }, [schoolSlug]);

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!comment.trim() || comment.trim().length < 5) {
      setFormError('Please write constructive review feedback (at least 5 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/schools/${schoolSlug}/ratings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score,
          title: title.trim() || undefined,
          comment: comment.trim(),
          categories: categoryRatings,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.message || 'Failed to submit parent review.');
        showToast(data.message || 'Failed to submit review', 'error');
        return;
      }

      showToast('Thank you! Your verified parent rating has been published.', 'success');
      setShowForm(false);
      setTitle('');
      setComment('');

      // Refresh list
      if (data.rating) {
        setRatings(prev => [data.rating, ...prev.filter(r => r.id !== data.rating.id)]);
      }
      if (data.summary) {
        setSummary(data.summary);
      }
    } catch {
      setFormError('Network error while saving rating.');
      showToast('Network error while submitting rating', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mt-14 pt-10 border-t border-[var(--color-border)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>Verified Parent Feedback</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-content)] tracking-tight">
            Parent Ratings & Reviews
          </h2>
          <p className="text-xs text-[var(--color-content-muted)] mt-1">
            Authentic experiences submitted exclusively by registered, verified families in Greater Noida.
          </p>
        </div>

        {isAuthenticated ? (
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(prev => !prev)}
            leftIcon={<Star className="w-4 h-4 fill-amber-300 text-amber-300" />}
            className="font-bold shrink-0"
          >
            {showForm ? 'Close Review Form' : 'Write Parent Review'}
          </Button>
        ) : (
          <Link href="/auth/login">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<LogIn className="w-3.5 h-3.5" />}
              className="font-bold text-xs shrink-0"
            >
              Sign In to Rate School
            </Button>
          </Link>
        )}
      </div>

      {/* Summary Scoreboard */}
      {summary && (
        <div className="bg-white rounded-2xl border border-[var(--color-border)] p-6 shadow-2xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Main Score */}
            <div className="flex flex-col items-center justify-center p-4 bg-amber-50/60 rounded-xl border border-amber-100 text-center">
              <div className="text-4xl sm:text-5xl font-black text-amber-900 tracking-tight">
                {summary.averageScore.toFixed(1)}
              </div>
              <div className="flex items-center gap-1 my-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(summary.averageScore)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-amber-800">
                Based on {summary.totalReviews} verified parent {summary.totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {/* Rating Breakdown Bars */}
            <div className="space-y-1.5 text-xs text-slate-600">
              {[5, 4, 3, 2, 1].map(stars => {
                const count = summary.distribution[stars] || 0;
                const pct = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-12 font-medium flex items-center gap-0.5 shrink-0">
                      <span>{stars}</span>
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                    </span>
                    <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 font-mono text-[11px] text-slate-400 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Category Dimension Badges */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Academics</span>
                <strong className="text-sm font-black text-slate-900">
                  {summary.categoryAverages.academics.toFixed(1)} / 5.0
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Infrastructure</span>
                <strong className="text-sm font-black text-slate-900">
                  {summary.categoryAverages.infrastructure.toFixed(1)} / 5.0
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Faculty</span>
                <strong className="text-sm font-black text-slate-900">
                  {summary.categoryAverages.faculty.toFixed(1)} / 5.0
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Safety & Transport</span>
                <strong className="text-sm font-black text-slate-900">
                  {summary.categoryAverages.safety.toFixed(1)} / 5.0
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Submission Form */}
      {showForm && (
        <form
          onSubmit={handleSubmitRating}
          className="bg-white rounded-2xl border border-sky-300 p-6 shadow-warm-sm mb-8 space-y-5 animate-fadeIn"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Write a Verified Parent Review for {schoolName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Posting as: <strong>{user?.name}</strong> ({user?.preferredSchoolLocality || 'Greater Noida'})
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              ✓ Verified Account
            </span>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{formError}</span>
            </div>
          )}

          {/* Interactive Star Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Overall Experience Rating (1 to 5 Stars)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => {
                const active = (hoverScore || score) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverScore(star)}
                    onMouseLeave={() => setHoverScore(0)}
                    onClick={() => setScore(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-115 focus:outline-none"
                    aria-label={`${star} Stars`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        active ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                      }`}
                    />
                  </button>
                );
              })}
              <span className="text-sm font-bold text-amber-800 ml-2">
                {score} of 5 Stars
              </span>
            </div>
          </div>

          {/* Category Sub-Ratings */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Category Assessment
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              {(['academics', 'infrastructure', 'faculty', 'safety'] as const).map(cat => (
                <div key={cat} className="space-y-1">
                  <label className="font-semibold text-slate-600 capitalize block">
                    {cat}
                  </label>
                  <select
                    value={categoryRatings[cat]}
                    onChange={e =>
                      setCategoryRatings(prev => ({
                        ...prev,
                        [cat]: Number(e.target.value),
                      }))
                    }
                    className="w-full bg-white border border-slate-300 rounded-lg py-1.5 px-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-sky-600"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4}>4 - Very Good</option>
                    <option value={3}>3 - Average</option>
                    <option value={2}>2 - Below Average</option>
                    <option value={1}>1 - Needs Improvement</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Review Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Headline / Summary (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Caring teachers and balanced academic curriculum"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600 bg-white"
            />
          </div>

          {/* Review Details */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Detailed Feedback for Parents <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="Share details about classroom environment, fee transparency, transport convenience, extracurriculars, or administrative communication..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              required
              className="w-full text-xs p-3 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-600 bg-white leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
              className="text-xs font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
              leftIcon={<Send className="w-3.5 h-3.5" />}
              className="font-bold text-xs"
            >
              Publish Verified Review
            </Button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Loading verified reviews...
          </div>
        ) : ratings.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-slate-700">No parent reviews yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first parent to share an audited review of {schoolName} with the Greater Noida West community.
            </p>
          </div>
        ) : (
          ratings.map(item => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white border border-[var(--color-border)] shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center">
                    {item.userName ? item.userName.charAt(0).toUpperCase() : 'P'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-slate-900">{item.userName}</h4>
                      {item.verifiedParent && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Parent</span>
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {item.userChildGrade ? `Child: ${item.userChildGrade}` : 'Parent in Greater Noida'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= item.score
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{item.score}.0</span>
                  <span className="text-[11px] text-slate-400 ml-2">
                    {new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              {item.title && (
                <h5 className="text-sm font-bold text-slate-800">{item.title}</h5>
              )}

              <p className="text-xs text-slate-600 leading-relaxed">{item.comment}</p>

              {item.categories && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100 text-[11px]">
                  {item.categories.academics && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      Academics: {item.categories.academics}/5
                    </span>
                  )}
                  {item.categories.infrastructure && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      Infra: {item.categories.infrastructure}/5
                    </span>
                  )}
                  {item.categories.faculty && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      Faculty: {item.categories.faculty}/5
                    </span>
                  )}
                  {item.categories.safety && (
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      Safety: {item.categories.safety}/5
                    </span>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
};
