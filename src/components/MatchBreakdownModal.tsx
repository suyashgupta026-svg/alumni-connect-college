import React from 'react';
import { X, CheckCircle2, AlertCircle, ArrowRight, BookOpen, Clock, Target, Briefcase } from 'lucide-react';
import { calculateMatch } from '../lib/matching';
import { UserProfile } from '../types';

interface MatchBreakdownModalProps {
  alumni: UserProfile;
  currentUser: UserProfile;
  onClose: () => void;
  onRequestMentorship: (alumni: UserProfile) => void;
}

export const MatchBreakdownModal: React.FC<MatchBreakdownModalProps> = ({
  alumni,
  currentUser,
  onClose,
  onRequestMentorship,
}) => {
  const match = calculateMatch(currentUser.studentData, alumni.alumniData);
  const data = alumni.alumniData!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-100 flex items-start justify-between bg-neutral-50/70">
          <div className="flex items-center gap-3">
            <img
              src={alumni.avatarUrl}
              alt={alumni.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-neutral-300"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">{alumni.name}</h3>
                <span className="text-xs text-slate-500 font-medium">({data.company})</span>
              </div>
              <p className="text-xs text-slate-600">
                Match breakdown for <span className="font-semibold text-slate-800">{currentUser.name}</span>
              </p>
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Score Banner */}
          <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-teal-800 uppercase tracking-wider mb-0.5">
                Overall Compatibility Score
              </p>
              <p className="text-xs text-slate-600">
                Calculated using transparent university career matching rules.
              </p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-teal-800 font-mono tabular-nums">
                {match.overallScore}%
              </span>
              <span className="block text-[11px] text-teal-700 font-medium">High Affinity</span>
            </div>
          </div>

          {/* 4 Score Breakdown Bars */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Scoring Dimension Breakdown
            </h4>

            {/* Dimension 1: Skills Overlap */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-teal-700" />
                  Skills Overlap (Max 40 pts)
                </span>
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {match.breakdown.skillsScore} / 40 pts
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-700 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(match.breakdown.skillsScore / 40) * 100}%` }}
                />
              </div>
            </div>

            {/* Dimension 2: Target Role */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-teal-700" />
                  Role &amp; Goal Trajectory (Max 30 pts)
                </span>
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {match.breakdown.roleScore} / 30 pts
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-700 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(match.breakdown.roleScore / 30) * 100}%` }}
                />
              </div>
            </div>

            {/* Dimension 3: Industry Match */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-teal-700" />
                  Industry Relevance (Max 20 pts)
                </span>
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {match.breakdown.industryScore} / 20 pts
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-700 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(match.breakdown.industryScore / 20) * 100}%` }}
                />
              </div>
            </div>

            {/* Dimension 4: Availability */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-700" />
                  Bandwidth &amp; Availability (Max 10 pts)
                </span>
                <span className="font-mono tabular-nums font-semibold text-slate-800">
                  {match.breakdown.availabilityScore} / 10 pts
                </span>
              </div>
              <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-teal-700 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(match.breakdown.availabilityScore / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Transparent Explanations */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Why this match was recommended
            </h4>
            <ul className="space-y-2">
              {match.reasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Gap Analysis: What you will learn */}
          {match.skillGaps.length > 0 && (
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Growth Opportunities &amp; Skill Gaps
              </h4>
              <p className="text-xs text-slate-600 mb-3">
                Skills {alumni.name} specializes in that can expand your candidate profile:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {match.skillGaps.map((skill) => (
                  <span
                    key={skill}
                    className="bg-white border border-neutral-300 text-slate-800 px-2.5 py-1 rounded text-xs font-medium"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-neutral-200/70 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onRequestMentorship(alumni);
            }}
            className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Proceed to Request Mentorship</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
