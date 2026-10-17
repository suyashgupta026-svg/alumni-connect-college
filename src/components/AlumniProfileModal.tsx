import React from 'react';
import { X, ShieldCheck, Calendar, Briefcase, GraduationCap, Video, FileText, Star, Clock, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface AlumniProfileModalProps {
  alumni: UserProfile;
  onClose: () => void;
  onRequestMentorship: (alumni: UserProfile, preferredFormat?: 'video_chat' | 'async_review') => void;
  onOpenMatchModal: (alumni: UserProfile) => void;
}

export const AlumniProfileModal: React.FC<AlumniProfileModalProps> = ({
  alumni,
  onClose,
  onRequestMentorship,
  onOpenMatchModal,
}) => {
  const data = alumni.alumniData!;
  const isVerified = data.verificationStatus === 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header Profile Banner */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50 flex items-start justify-between">
          <div className="flex items-start gap-4">
            <img
              src={alumni.avatarUrl}
              alt={alumni.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full object-cover border border-neutral-300 shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">{alumni.name}</h2>
                {isVerified && (
                  <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified Alumnus</span>
                  </div>
                )}
              </div>
              <p className="text-sm font-semibold text-slate-700 mt-0.5">
                {data.currentTitle} @ {data.company}
              </p>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                <span>{data.industry}</span>
                <span aria-hidden="true">·</span>
                <span>{data.yearsExperience} yrs experience</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">★ {data.ratingAverage.toFixed(1)} ({data.sessionsCompletedCount} sessions)</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-slate-700 rounded-lg hover:bg-neutral-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Verification Badge & Audit Note */}
          {data.verificationNote && (
            <div className="bg-emerald-50/50 border border-emerald-200/70 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Institutional Verification Record:</span> {data.verificationNote}
              </div>
            </div>
          )}

          {/* Bio & Mentoring Philosophy */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              About &amp; Mentoring Philosophy
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed mb-3">{alumni.bio}</p>
            <div className="bg-neutral-50 rounded-lg p-3.5 border border-neutral-200/80 text-xs italic text-slate-600">
              "{data.mentoringPhilosophy}"
            </div>
          </div>

          {/* Education & Past Journey */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-neutral-200 rounded-xl p-4 bg-white">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                <GraduationCap className="w-4 h-4 text-teal-700" />
                <span>Alma Mater &amp; Degree</span>
              </div>
              <p className="text-sm font-semibold text-slate-900">{alumni.university}</p>
              <p className="text-xs text-slate-600 mt-0.5">
                {data.degree} in {data.major} · Class of {data.graduationYear}
              </p>
            </div>

            <div className="border border-neutral-200 rounded-xl p-4 bg-white">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                <Briefcase className="w-4 h-4 text-teal-700" />
                <span>Career Journey</span>
              </div>
              <p className="text-xs text-slate-700">
                Current: <span className="font-semibold text-slate-900">{data.company}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Previous: {data.pastCompanies.join(' · ')}
              </p>
            </div>
          </div>

          {/* Expertise Skills */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Core Skills &amp; Advisory Topics
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {data.expertiseSkills.map((skill) => (
                <span
                  key={skill}
                  className="bg-neutral-50 border border-neutral-200 text-slate-800 px-3 py-1 rounded-md text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Available Slots & Formats */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Availability &amp; Format Options
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                  <Video className="w-3.5 h-3.5 text-teal-700" />
                  <span>30-min Video Coffee Chats</span>
                </div>
                <p className="text-slate-500 mb-2">Google Meet video link provided upon acceptance.</p>
                {data.availableSlots.length > 0 ? (
                  <div className="space-y-1">
                    {data.availableSlots.map((slot) => (
                      <div key={slot.id} className="text-slate-700 font-mono text-[11px]">
                        • {slot.dayOfWeek} ({slot.time})
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-neutral-400">No recurring live slots currently posted.</span>
                )}
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                  <span>Async Portfolio &amp; Resume Critiques</span>
                </div>
                <p className="text-slate-500">
                  Submit your PDF or live portfolio URL. Mentor provides comprehensive written feedback within 48–72 hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onOpenMatchModal(alumni)}
            className="text-xs font-semibold text-teal-800 hover:text-teal-900 underline"
          >
            Inspect Match Breakdown
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-neutral-200/60 rounded-lg transition-colors"
            >
              Cancel
            </button>

            {data.availableFormats === 'both' ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestMentorship(alumni, 'async_review');
                  }}
                  className="px-3.5 py-2 text-xs font-semibold text-teal-800 bg-white border border-teal-800 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  Request Async Review
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRequestMentorship(alumni, 'video_chat');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
                >
                  Schedule 1-on-1 Chat
                </button>
              </>
            ) : data.availableFormats === 'video_chat' ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestMentorship(alumni, 'video_chat');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
              >
                Schedule 1-on-1 Chat
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestMentorship(alumni, 'async_review');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-700 transition-colors shadow-xs"
              >
                Request Async Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
