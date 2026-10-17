import React from 'react';
import { ArrowRight, ShieldCheck, CheckCircle2, Video, FileText, Sparkles, BookOpen, Clock } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { UserProfile } from '../types';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onSelectAlumni: (alumni: UserProfile) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onSelectAlumni }) => {
  const featuredAlumni = StorageService.getAlumni().slice(0, 3);

  return (
    <div className="bg-[#FBFBF9] text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 tracking-wide uppercase mb-4">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Verified Higher-Ed Alumni Network</span>
                <span aria-hidden="true" className="text-neutral-400">·</span>
                <span>Class of 2012–2025</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6 [text-wrap:balance]">
                Bridge the gap between campus and your dream tech career.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl leading-relaxed">
                Connect directly with verified university alumni for 30-minute virtual coffee chats and rigorous asynchronous portfolio reviews, powered by transparent skill-matching criteria.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-10">
                <button
                  type="button"
                  onClick={() => onNavigate('directory')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  <span>Explore Verified Mentors</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('how-it-works')}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  View Matching Rules
                </button>
              </div>

              {/* Zero-Pill Trust Bar */}
              <div className="pt-6 border-t border-neutral-200/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  <span>Registrar & LinkedIn verified</span>
                </div>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  <span>No cold message ghosting</span>
                </div>
                <span aria-hidden="true" className="text-neutral-300">·</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-700" />
                  <span>100% free for students</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Campus Photo */}
            <div className="lg:col-span-5 flex items-stretch">
              <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-300/80 shadow-md bg-neutral-100 min-h-[380px] lg:min-h-full">
                <img
                  src="/src/assets/images/hero_alumni_campus_1792252667080.jpg"
                  alt="Students and alumnus mentor in university campus quad"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-6 text-white">
                  <p className="text-sm font-medium">Alumify Campus Chapter</p>
                  <p className="text-xs text-neutral-300">Connecting undergraduate seniors and graduate students with senior industry alumni.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width 4-Column KPI Strip */}
      <section className="bg-white border-b border-neutral-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono tabular-nums">1,240+</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Verified Alumni</p>
            </div>
            <div className="p-4 border-l border-neutral-200">
              <p className="text-3xl sm:text-4xl font-bold text-teal-800 font-mono tabular-nums">96.4%</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Session Satisfaction</p>
            </div>
            <div className="p-4 border-l border-neutral-200">
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono tabular-nums">&lt; 48 hrs</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Average Response Time</p>
            </div>
            <div className="p-4 border-l border-neutral-200">
              <p className="text-3xl sm:text-4xl font-bold text-slate-900 font-mono tabular-nums">3,800+</p>
              <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">Coffee Chats & Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 3-Step Mentorship Mechanism */}
      <section className="py-16 lg:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-semibold text-teal-800 tracking-wider uppercase mb-2">
            Structured & Accountable
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight [text-wrap:balance]">
            How Alumify powers high-signal mentorship
          </h3>
          <p className="text-base text-slate-600 mt-4 leading-relaxed">
            Unlike cold LinkedIn InMails that get ignored, Alumify provides structured availability, explicit match breakdowns, and committed formats.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl p-8 border border-neutral-200 flex flex-col justify-between hover:border-neutral-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-sm mb-6">
                01
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Build your Career Goal Profile
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Define your target roles (e.g. Frontend Engineer, Product Manager), target industry sectors, current technical proficiencies, and learning objectives.
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono pt-4 border-t border-neutral-100">
              Focus: Goals &amp; Skills Gap
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl p-8 border border-neutral-200 flex flex-col justify-between hover:border-neutral-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-sm mb-6">
                02
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Review Explainable Compatibility
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                See exact compatibility percentages and transparent scoring rationales based on verified skill overlaps, past company tracks, and open calendar slots.
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono pt-4 border-t border-neutral-100">
              Formula: 40% Skills · 30% Role · 20% Industry
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl p-8 border border-neutral-200 flex flex-col justify-between hover:border-neutral-300 transition-colors">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center font-bold text-sm mb-6">
                03
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">
                Book Video Chat or Async Review
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Choose between a focused 30-minute virtual 1-on-1 coffee chat or submit your portfolio link for detailed asynchronous rubric feedback from working alumni.
              </p>
            </div>
            <div className="text-xs text-slate-400 font-mono pt-4 border-t border-neutral-100">
              Formats: Google Meet · Line-by-line Critique
            </div>
          </div>
        </div>
      </section>

      {/* Featured Verified Alumni Spotlight */}
      <section className="bg-white py-16 lg:py-24 border-t border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2 className="text-xs font-semibold text-teal-800 tracking-wider uppercase mb-2">
                Alumni Spotlight
              </h2>
              <h3 className="text-3xl font-bold text-slate-900 tracking-tight">
                Connect with mentors from top engineering &amp; product teams
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('directory')}
              className="text-sm font-semibold text-teal-800 hover:text-teal-900 flex items-center gap-1.5 shrink-0"
            >
              <span>View all alumni mentors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredAlumni.map((alum) => {
              const data = alum.alumniData!;
              return (
                <div
                  key={alum.id}
                  className="bg-[#FBFBF9] rounded-xl border border-neutral-200 p-6 flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={alum.avatarUrl}
                        alt={alum.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border border-neutral-300 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-slate-900 text-base">{alum.name}</h4>
                          {data.verificationStatus === 'verified' && (
                            <span title="Verified Alumni">
                              <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-700 mt-0.5">{data.currentTitle}</p>
                        <p className="text-xs text-slate-500">{data.company} · {data.industry}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                      "{data.mentoringPhilosophy}"
                    </p>

                    {/* Unboxed Metadata (Zero-Pill discipline) */}
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 mb-5">
                      <span>Class of '{String(data.graduationYear).slice(-2)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{data.sessionsCompletedCount} sessions</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">★ {data.ratingAverage.toFixed(1)}</span>
                    </div>

                    <div className="text-xs text-slate-600 mb-6">
                      <span className="text-slate-400 block mb-1">Expertise:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {data.expertiseSkills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="bg-white border border-neutral-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectAlumni(alum)}
                    className="w-full py-2.5 px-4 text-xs font-semibold text-teal-800 bg-white border border-teal-800/30 rounded-lg hover:bg-teal-800 hover:text-white transition-colors"
                  >
                    View Match &amp; Profile
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Claim-to-Proof Adjacency Testimonial */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-mono text-teal-400 uppercase tracking-widest mb-4">
              Real Alumni Impact
            </p>
            <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed mb-8">
              "Connecting with David Chen on Alumify gave me the exact architecture framework I needed for my final-round systems interview. His line-by-line resume critique transformed how I explain my capstone project."
            </blockquote>
            <div className="flex items-center gap-4">
              <img
                src="/src/assets/images/avatar_student_maya_1792252668700.jpg"
                alt="Maya Lin"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full object-cover border border-neutral-700"
              />
              <div>
                <p className="font-bold text-sm text-white">Maya Lin</p>
                <p className="text-xs text-neutral-400">Junior in Computer Science · Stanford University</p>
                <p className="text-[11px] text-teal-400 mt-0.5">Accepted Summer 2026 Engineering Offer</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
