import React, { useState } from 'react';
import { Video, FileText, Calendar, Clock, CheckCircle2, AlertCircle, ExternalLink, Star, MessageSquare, ArrowRight, Sparkles, User } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { MentorshipRequest, UserProfile } from '../types';

interface StudentDashboardProps {
  currentUser: UserProfile;
  onNavigate: (view: string) => void;
  onOpenProfileEditor: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  currentUser,
  onNavigate,
  onOpenProfileEditor,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'declined'>('all');
  const [reviewingRequest, setReviewingRequest] = useState<MentorshipRequest | null>(null);
  const [rating, setRating] = useState(5);
  const [testimonial, setTestimonial] = useState('');

  const allRequests = StorageService.getRequests().filter(
    (r) => r.studentId === currentUser.id
  );

  const studentData = currentUser.studentData;

  const filteredRequests = allRequests.filter((r) => {
    if (activeTab === 'all') return true;
    return r.status === activeTab;
  });

  const pendingCount = allRequests.filter((r) => r.status === 'pending').length;
  const acceptedCount = allRequests.filter((r) => r.status === 'accepted').length;
  const completedCount = allRequests.filter((r) => r.status === 'completed').length;

  const handleCompleteReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewingRequest) return;
    StorageService.completeRequestWithReview(reviewingRequest.id, {
      studentRating: rating,
      studentTestimonial: testimonial.trim() || 'Exceptional mentorship session with actionable insights.',
    });
    setReviewingRequest(null);
  };

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xs">
          <div className="flex items-start gap-4">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border border-neutral-300 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900">{currentUser.name}</h1>
                <span className="text-xs bg-teal-50 border border-teal-200 text-teal-800 font-semibold px-2 py-0.5 rounded">
                  Student Member
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {studentData?.degreeLevel} {studentData?.major} · {currentUser.university} (Class of {studentData?.graduationYear})
              </p>
              <div className="text-xs text-slate-500 mt-1.5 flex flex-wrap items-center gap-x-2">
                <span>Targeting: <strong className="text-slate-700">{studentData?.targetRoles.join(', ')}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Industries: <strong className="text-slate-700">{studentData?.targetIndustries.join(', ')}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenProfileEditor}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Update Career Goals &amp; Skills
            </button>
            <button
              type="button"
              onClick={() => onNavigate('directory')}
              className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
            >
              Browse Mentors
            </button>
          </div>
        </div>

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Mentor Reviews</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">{pendingCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Awaiting mentor acceptance</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider">Scheduled &amp; Active</p>
            <p className="text-3xl font-extrabold text-teal-800 mt-2 font-mono tabular-nums">{acceptedCount}</p>
            <p className="text-[11px] text-teal-700 mt-1">Live calls or pending feedback</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Sessions</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">{completedCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Archived advice &amp; feedback notes</p>
          </div>
        </div>

        {/* Request Tracker Section */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mentorship Request Tracker</h2>
              <p className="text-xs text-slate-500">Track incoming responses, Google Meet links, and written reviews.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({allRequests.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('accepted')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'accepted' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active ({acceptedCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed ({completedCount})
              </button>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm font-semibold text-slate-700 mb-1">No requests under this tab</p>
              <p className="text-xs text-slate-500 mb-4">
                Explore the alumni directory to discover mentors and submit your first request.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('directory')}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors"
              >
                Find Alumni Mentors
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const isAccepted = req.status === 'accepted';
                const isCompleted = req.status === 'completed';
                const isPending = req.status === 'pending';
                const isDeclined = req.status === 'declined';

                return (
                  <div
                    key={req.id}
                    className="border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      {/* Left: Mentor Info & Topic */}
                      <div className="flex items-start gap-3.5">
                        <img
                          src={req.alumniAvatar}
                          alt={req.alumniName}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-full object-cover border border-neutral-300 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{req.alumniName}</h3>
                            <span className="text-xs text-slate-500">· {req.alumniTitle} @ {req.alumniCompany}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 mt-1">
                            Topic: {req.topic}
                          </p>
                          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 mt-1">
                            <span className="flex items-center gap-1 font-medium">
                              {req.format === 'video_chat' ? (
                                <>
                                  <Video className="w-3.5 h-3.5 text-teal-700" />
                                  <span>1-on-1 Coffee Chat</span>
                                </>
                              ) : (
                                <>
                                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                                  <span>Async Critique</span>
                                </>
                              )}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span>Requested {new Date(req.createdAt).toLocaleDateString()}</span>
                            {req.preferredTimeSlot && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="font-mono text-slate-600">{req.preferredTimeSlot}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right: Status Tag */}
                      <div className="shrink-0">
                        {isAccepted && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Accepted &amp; Scheduled</span>
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 border border-neutral-300">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        )}
                        {isDeclined && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-800 border border-red-200">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>Declined (At Capacity)</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Note & Target Outcome */}
                    <div className="mt-3.5 pt-3.5 border-t border-neutral-100 text-xs text-slate-600 space-y-1.5">
                      <p>
                        <strong className="text-slate-800">Your note:</strong> "{req.message}"
                      </p>
                      <p>
                        <strong className="text-slate-800">Target outcome:</strong> {req.targetOutcome}
                      </p>
                    </div>

                    {/* Active Session Live Controls */}
                    {isAccepted && (
                      <div className="mt-4 p-4 bg-teal-50/60 border border-teal-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div>
                          <p className="font-semibold text-teal-900">
                            {req.format === 'video_chat' ? 'Live Session Scheduled' : 'Async Review in Progress'}
                          </p>
                          <p className="text-teal-800 text-[11px] mt-0.5">
                            {req.format === 'video_chat'
                              ? `Scheduled for: ${req.scheduledTime ? new Date(req.scheduledTime).toLocaleString() : req.preferredTimeSlot}`
                              : 'Mentor is currently inspecting your portfolio link.'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {req.meetingLink && (
                            <a
                              href={req.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3.5 py-1.5 font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                            >
                              <span>Join Google Meet</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => setReviewingRequest(req)}
                            className="px-3.5 py-1.5 font-semibold text-teal-900 bg-white border border-teal-300 hover:bg-teal-50 rounded-lg transition-colors"
                          >
                            Mark Complete &amp; Leave Review
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Completed Outcome & Feedback Display */}
                    {isCompleted && req.mentorFeedback && (
                      <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs">
                        <p className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-teal-700" />
                          <span>Alumni Takeaways &amp; Mentoring Feedback:</span>
                        </p>
                        <p className="text-slate-700 leading-relaxed italic">
                          "{req.mentorFeedback}"
                        </p>
                        {req.studentRating && (
                          <div className="mt-2 text-slate-500 font-mono text-[11px] flex items-center gap-1">
                            <span>Your session rating:</span>
                            <span className="text-amber-600 font-bold">★ {req.studentRating} / 5</span>
                            {req.studentTestimonial && (
                              <span>— "{req.studentTestimonial}"</span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Leave Review Modal */}
      {reviewingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-neutral-200 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Complete Mentorship with {reviewingRequest.alumniName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Share your session rating and brief takeaways to celebrate the mentor's guidance.
            </p>

            <form onSubmit={handleCompleteReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Session Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`p-2 rounded-lg border text-sm transition-colors ${
                        star <= rating
                          ? 'bg-amber-50 border-amber-300 text-amber-600 font-bold'
                          : 'bg-neutral-50 border-neutral-200 text-slate-400'
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Takeaways &amp; Testimonial (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. David provided direct actionable feedback on my technical interviews..."
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewingRequest(null)}
                  className="px-3.5 py-2 font-medium text-slate-700 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Submit &amp; Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
