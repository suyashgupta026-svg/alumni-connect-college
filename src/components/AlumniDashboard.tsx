import React, { useState } from 'react';
import { ShieldCheck, Video, FileText, CheckCircle2, XCircle, Clock, ExternalLink, MessageSquare, Send, Calendar, Star } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { MentorshipRequest, UserProfile } from '../types';

interface AlumniDashboardProps {
  currentUser: UserProfile;
  onOpenProfileEditor: () => void;
}

export const AlumniDashboard: React.FC<AlumniDashboardProps> = ({
  currentUser,
  onOpenProfileEditor,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'accepted' | 'completed'>('pending');
  const [acceptingReq, setAcceptingReq] = useState<MentorshipRequest | null>(null);
  const [decliningReq, setDecliningReq] = useState<MentorshipRequest | null>(null);
  const [feedbackReq, setFeedbackReq] = useState<MentorshipRequest | null>(null);

  // Form states
  const [customMeetingLink, setCustomMeetingLink] = useState('https://meet.google.com/alm-xkvp-zyd');
  const [declineReason, setDeclineReason] = useState('Currently at capacity with work commitments this month.');
  const [mentorFeedbackText, setMentorFeedbackText] = useState('');

  const alumniData = currentUser.alumniData!;
  const allRequests = StorageService.getRequests().filter(
    (r) => r.alumniId === currentUser.id
  );

  const pendingRequests = allRequests.filter((r) => r.status === 'pending');
  const acceptedRequests = allRequests.filter((r) => r.status === 'accepted');
  const completedRequests = allRequests.filter((r) => r.status === 'completed');

  const handleToggleAccepting = () => {
    StorageService.updateUserProfile(currentUser.id, {
      alumniData: {
        ...alumniData,
        isAcceptingRequests: !alumniData.isAcceptingRequests,
      },
    });
  };

  const handleConfirmAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptingReq) return;

    StorageService.updateRequestStatus(acceptingReq.id, 'accepted', {
      meetingLink: acceptingReq.format === 'video_chat' ? customMeetingLink : undefined,
      scheduledTime: acceptingReq.format === 'video_chat' ? new Date().toISOString() : undefined,
    });
    setAcceptingReq(null);
  };

  const handleConfirmDecline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningReq) return;

    StorageService.updateRequestStatus(decliningReq.id, 'declined', {
      statusReason: declineReason,
    });
    setDecliningReq(null);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackReq) return;

    StorageService.updateRequestStatus(feedbackReq.id, 'completed', {
      mentorFeedback: mentorFeedbackText.trim() || 'Reviewed project structure and recommended high-leverage optimizations.',
    });
    setFeedbackReq(null);
  };

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome & Capacity Header */}
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
                {alumniData.verificationStatus === 'verified' && (
                  <span className="flex items-center gap-1 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified Alumnus</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {alumniData.currentTitle} at {alumniData.company} · {alumniData.industry} (Class of {alumniData.graduationYear})
              </p>
              <div className="text-xs text-slate-500 mt-1.5 flex flex-wrap items-center gap-x-2">
                <span>{alumniData.yearsExperience} yrs experience</span>
                <span aria-hidden="true">·</span>
                <span>Capacity: <strong>{alumniData.weeklySlotCapacity} sessions / week</strong></span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Live Accepting Status Toggle */}
            <button
              type="button"
              onClick={handleToggleAccepting}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-2 cursor-pointer ${
                alumniData.isAcceptingRequests
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-neutral-100 border-neutral-300 text-slate-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${alumniData.isAcceptingRequests ? 'bg-emerald-600' : 'bg-slate-400'}`} />
              <span>{alumniData.isAcceptingRequests ? 'Accepting Requests' : 'Requests Paused'}</span>
            </button>

            <button
              type="button"
              onClick={onOpenProfileEditor}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
            >
              Edit Mentoring Profile
            </button>
          </div>
        </div>

        {/* Mentorship Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Inbound Requests</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">{pendingRequests.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Require your review</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider">Active Scheduled</p>
            <p className="text-3xl font-extrabold text-teal-800 mt-2 font-mono tabular-nums">{acceptedRequests.length}</p>
            <p className="text-[11px] text-teal-700 mt-1">Confirmed video chats/critiques</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sessions Mentored</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
              {alumniData.sessionsCompletedCount}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Lifetime college mentorships</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Student Rating</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
              ★ {alumniData.ratingAverage.toFixed(1)}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">From student reviews</p>
          </div>
        </div>

        {/* Requests Management Desk */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Mentorship Request Desk</h2>
              <p className="text-xs text-slate-500">Review student applications, confirm meeting links, and submit critique notes.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('pending')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Inbound Pending ({pendingRequests.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('accepted')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'accepted' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Scheduled ({acceptedRequests.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('completed')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'completed' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Past Completed ({completedRequests.length})
              </button>
            </div>
          </div>

          {/* Pending Inbound Requests */}
          {activeTab === 'pending' && (
            <div>
              {pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-8 h-8 text-teal-700 mx-auto mb-2 opacity-80" />
                  <p className="text-sm font-semibold text-slate-800">All caught up!</p>
                  <p className="text-xs text-slate-500">No pending student requests waiting for your review.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          <img
                            src={req.studentAvatar}
                            alt={req.studentName}
                            referrerPolicy="no-referrer"
                            className="w-12 h-12 rounded-full object-cover border border-neutral-300 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-sm">{req.studentName}</h3>
                              <span className="text-xs text-slate-500">· {req.studentMajor}</span>
                            </div>
                            <p className="text-xs text-teal-800 font-semibold mt-0.5">
                              Target Role: {req.studentTargetRole}
                            </p>
                            <p className="text-xs font-semibold text-slate-800 mt-1">
                              Topic: {req.topic}
                            </p>
                            <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 mt-1">
                              <span className="flex items-center gap-1 font-medium">
                                {req.format === 'video_chat' ? (
                                  <>
                                    <Video className="w-3.5 h-3.5 text-teal-700" />
                                    <span>30-min Coffee Chat</span>
                                  </>
                                ) : (
                                  <>
                                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                                    <span>Async Portfolio Review</span>
                                  </>
                                )}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>Received {new Date(req.createdAt).toLocaleDateString()}</span>
                              {req.preferredTimeSlot && (
                                <>
                                  <span aria-hidden="true">·</span>
                                  <span className="font-mono text-slate-700 font-medium">
                                    Slot: {req.preferredTimeSlot}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Decision Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => setDecliningReq(req)}
                            className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors"
                          >
                            Decline
                          </button>
                          <button
                            type="button"
                            onClick={() => setAcceptingReq(req)}
                            className="px-4 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                          >
                            Accept Request
                          </button>
                        </div>
                      </div>

                      {/* Student Message Body */}
                      <div className="mt-4 pt-3.5 border-t border-neutral-100 text-xs text-slate-700 space-y-2">
                        <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200/80">
                          <p className="font-medium text-slate-800 mb-1">Student Note:</p>
                          <p className="leading-relaxed">"{req.message}"</p>
                        </div>
                        <p>
                          <strong className="text-slate-800">Target outcome requested:</strong> {req.targetOutcome}
                        </p>
                        {req.documentUrl && (
                          <p className="flex items-center gap-1.5 text-teal-800">
                            <strong>Portfolio URL:</strong>
                            <a
                              href={req.documentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline hover:text-teal-900 flex items-center gap-1"
                            >
                              <span>{req.documentUrl}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Active Scheduled Sessions */}
          {activeTab === 'accepted' && (
            <div>
              {acceptedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm font-semibold text-slate-800">No active scheduled sessions</p>
                  <p className="text-xs text-slate-500">Accepted requests will appear here with call links.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {acceptedRequests.map((req) => (
                    <div
                      key={req.id}
                      className="border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-colors bg-white"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900 text-sm">{req.studentName}</h3>
                            <span className="text-xs text-slate-500">({req.studentMajor})</span>
                            <span className="text-xs bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                              Active Scheduled
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 mt-1">Topic: {req.topic}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {req.preferredTimeSlot || 'Time slot agreed upon'}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {req.meetingLink && (
                            <a
                              href={req.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 text-xs font-semibold text-teal-900 bg-teal-50 border border-teal-200 rounded-lg hover:bg-teal-100 transition-colors flex items-center gap-1"
                            >
                              <span>Open Meet</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setFeedbackReq(req);
                              setMentorFeedbackText(req.mentorFeedback || '');
                            }}
                            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                          >
                            Submit Feedback &amp; Complete
                          </button>
                        </div>
                      </div>

                      {req.documentUrl && (
                        <div className="mt-3 text-xs">
                          <a
                            href={req.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-800 underline font-medium hover:text-teal-900 flex items-center gap-1"
                          >
                            <span>Inspect Student Document / Portfolio</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Past Completed Sessions */}
          {activeTab === 'completed' && (
            <div>
              {completedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm font-semibold text-slate-800">No completed sessions yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {completedRequests.map((req) => (
                    <div key={req.id} className="border border-neutral-200 rounded-xl p-5 bg-neutral-50/50">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{req.studentName}</h3>
                          <span className="text-xs text-slate-500">· {req.topic}</span>
                        </div>
                        <span className="text-xs font-mono text-slate-400">
                          Completed {new Date(req.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {req.mentorFeedback && (
                        <p className="text-xs text-slate-700 italic mb-2">
                          "Your feedback: {req.mentorFeedback}"
                        </p>
                      )}
                      {req.studentTestimonial && (
                        <p className="text-xs text-teal-900 bg-teal-50 border border-teal-200 p-2.5 rounded-lg">
                          Student Testimonial (★ {req.studentRating}/5): "{req.studentTestimonial}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Accept Request Modal */}
      {acceptingReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-neutral-200 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Accept Request from {acceptingReq.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Confirm the session details and video meeting link.
            </p>

            <form onSubmit={handleConfirmAccept} className="space-y-4 text-xs">
              {acceptingReq.format === 'video_chat' && (
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                    Google Meet / Video Conference Link
                  </label>
                  <input
                    type="url"
                    value={customMeetingLink}
                    onChange={(e) => setCustomMeetingLink(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Student will receive this link automatically on their dashboard.
                  </p>
                </div>
              )}

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAcceptingReq(null)}
                  className="px-3.5 py-2 font-medium text-slate-700 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Confirm &amp; Accept
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decline Request Modal */}
      {decliningReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full border border-neutral-200 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Decline Request from {decliningReq.studentName}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Provide a constructive note so the student understands your current capacity.
            </p>

            <form onSubmit={handleConfirmDecline} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Reason for Declining
                </label>
                <textarea
                  rows={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDecliningReq(null)}
                  className="px-3.5 py-2 font-medium text-slate-700 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-red-700 hover:bg-red-800 rounded-lg shadow-xs"
                >
                  Decline Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback / Complete Session Modal */}
      {feedbackReq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Complete Session &amp; Submit Mentoring Feedback
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              For {feedbackReq.studentName} ({feedbackReq.topic})
            </p>

            <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Key Feedback &amp; Action Items for Student *
                </label>
                <textarea
                  rows={4}
                  placeholder="e.g. Maya demonstrated great fundamentals in React. I advised her to highlight latency measurements in her capstone and practice dynamic programming for technical phone screens..."
                  value={mentorFeedbackText}
                  onChange={(e) => setMentorFeedbackText(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
                />
              </div>

              <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFeedbackReq(null)}
                  className="px-3.5 py-2 font-medium text-slate-700 hover:bg-neutral-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs"
                >
                  Save &amp; Complete Session
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
