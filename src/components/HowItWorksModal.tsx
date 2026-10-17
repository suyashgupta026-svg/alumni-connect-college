import React from 'react';
import { X, BookOpen, Target, Briefcase, Clock, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface HowItWorksModalProps {
  onClose: () => void;
  onExploreMentors: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({
  onClose,
  onExploreMentors,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                Alumify Explainable Matching Rules
              </h2>
              <span className="text-xs bg-teal-50 border border-teal-200 text-teal-800 font-semibold px-2 py-0.5 rounded">
                Deterministic
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Transparent, rule-based scoring criteria that connect students with the right alumni mentors.
            </p>
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
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed">
          <div className="bg-teal-50/50 border border-teal-200/80 rounded-xl p-4">
            <h3 className="font-bold text-teal-900 text-sm mb-1">
              Deterministic &amp; Explainable by Design
            </h3>
            <p className="text-slate-600">
              Alumify does not use black-box heuristics or unverifiable buzzword algorithms. Every match score (0–100%) is calculated using a transparent weighted multi-factor formula based directly on verified user profile attributes.
            </p>
          </div>

          {/* 4 Pillars */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              The 4 Scoring Dimensions
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <BookOpen className="w-4 h-4 text-teal-700" />
                    <span>Skills Overlap</span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-teal-800">40% Weight</span>
                </div>
                <p className="text-slate-600">
                  Calculates direct overlap between the student's current proficiencies, target learning goals, and the mentor's verified industry skillset.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Target className="w-4 h-4 text-teal-700" />
                    <span>Role Trajectory</span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-teal-800">30% Weight</span>
                </div>
                <p className="text-slate-600">
                  Evaluates alignment between the student's target roles and the mentor's current title or past company experience.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Briefcase className="w-4 h-4 text-teal-700" />
                    <span>Industry Relevance</span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-teal-800">20% Weight</span>
                </div>
                <p className="text-slate-600">
                  Aligns the student's desired sectors (e.g. Fintech, Developer Tools, SaaS) with the alumni employer's industry.
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Clock className="w-4 h-4 text-teal-700" />
                    <span>Availability &amp; Capacity</span>
                  </div>
                  <span className="font-mono tabular-nums font-bold text-teal-800">10% Weight</span>
                </div>
                <p className="text-slate-600">
                  Rewards mentors who actively maintain open weekly calendar slots and active acceptance status to ensure swift response times.
                </p>
              </div>
            </div>
          </div>

          {/* Formats & Verification */}
          <div className="border-t border-neutral-200 pt-5 space-y-3">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              Hybrid Mentorship Workflows
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  <strong>30-Minute Virtual Coffee Chats:</strong> Synchronous conversations via Google Meet focused on system design prep, career trajectory, or offer negotiation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Async Portfolio &amp; Resume Critiques:</strong> Asynchronous reviews where students submit URLs and receive structured written rubrics within 48–72 hours.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Protected Alumni Verification:</strong> Institutional coordinators verify graduation years, university records, and corporate directory domains before granting the Verified Badge.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-medium text-slate-700 hover:bg-neutral-200/70 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onExploreMentors();
            }}
            className="px-5 py-2 font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>Explore Matching Mentors</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
