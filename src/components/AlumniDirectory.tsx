import React, { useState, useMemo } from 'react';
import { Search, Filter, ShieldCheck, Video, FileText, Sparkles, Check, ChevronRight, User } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { calculateMatch } from '../lib/matching';
import { UserProfile, StudentProfileData } from '../types';

interface AlumniDirectoryProps {
  currentUser: UserProfile;
  onSelectAlumni: (alumni: UserProfile) => void;
  onOpenMatchModal: (alumni: UserProfile) => void;
  onRequestMentorship: (alumni: UserProfile) => void;
}

export const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({
  currentUser,
  onSelectAlumni,
  onOpenMatchModal,
  onRequestMentorship,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(true);
  const [availableSlotsOnly, setAvailableSlotsOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'match' | 'experience' | 'sessions' | 'rating'>('match');

  const allAlumni = StorageService.getAlumni();
  const studentData: StudentProfileData | undefined = currentUser.studentData;

  // Compute matches and filter results
  const alumniWithScores = useMemo(() => {
    return allAlumni.map((alum) => {
      const match = calculateMatch(studentData, alum.alumniData);
      return {
        profile: alum,
        match,
      };
    });
  }, [allAlumni, studentData]);

  const filteredAlumni = useMemo(() => {
    return alumniWithScores.filter(({ profile, match }) => {
      const data = profile.alumniData!;
      
      // Search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = profile.name.toLowerCase().includes(query);
        const matchesCompany = data.company.toLowerCase().includes(query);
        const matchesTitle = data.currentTitle.toLowerCase().includes(query);
        const matchesIndustry = data.industry.toLowerCase().includes(query);
        const matchesSkills = data.expertiseSkills.some((s) => s.toLowerCase().includes(query));
        if (!matchesName && !matchesCompany && !matchesTitle && !matchesIndustry && !matchesSkills) {
          return false;
        }
      }

      // Industry
      if (selectedIndustry !== 'all' && data.industry.toLowerCase() !== selectedIndustry.toLowerCase()) {
        return false;
      }

      // Format
      if (selectedFormat !== 'all') {
        if (selectedFormat === 'video_chat' && data.availableFormats === 'async_review') return false;
        if (selectedFormat === 'async_review' && data.availableFormats === 'video_chat') return false;
      }

      // Verified Only
      if (verifiedOnly && data.verificationStatus !== 'verified') {
        return false;
      }

      // Open Slots Only
      if (availableSlotsOnly && (!data.isAcceptingRequests || data.availableSlots.length === 0)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'match') {
        return b.match.overallScore - a.match.overallScore;
      }
      if (sortBy === 'experience') {
        return b.profile.alumniData!.yearsExperience - a.profile.alumniData!.yearsExperience;
      }
      if (sortBy === 'sessions') {
        return b.profile.alumniData!.sessionsCompletedCount - a.profile.alumniData!.sessionsCompletedCount;
      }
      if (sortBy === 'rating') {
        return b.profile.alumniData!.ratingAverage - a.profile.alumniData!.ratingAverage;
      }
      return 0;
    });
  }, [alumniWithScores, searchQuery, selectedIndustry, selectedFormat, verifiedOnly, availableSlotsOnly, sortBy]);

  const industries = ['all', 'Developer Tools', 'Fintech', 'SaaS', 'Cybersecurity'];

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Alumni Mentor Directory
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Explore verified alumni, view explainable match scores, and request career guidance.
              </p>
            </div>
            {studentData && (
              <div className="text-xs bg-white border border-neutral-200 rounded-lg p-3 max-w-md shadow-xs">
                <span className="font-semibold text-slate-800">Scoring profile for {currentUser.name}:</span>
                <span className="text-slate-500 block mt-0.5 truncate">
                  Target: {studentData.targetRoles.join(', ')} · Industry: {studentData.targetIndustries.join(', ')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 sm:p-5 mb-8 shadow-xs space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by mentor name, company (e.g. Stripe, Datadog), title, or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-700/20 focus:border-teal-700 transition-all placeholder:text-neutral-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-700"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Industry Selector */}
            <div className="md:col-span-3">
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                aria-label="Filter by industry"
                className="w-full py-2.5 px-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
              >
                <option value="all">All Industries</option>
                <option value="Developer Tools">Developer Tools</option>
                <option value="Fintech">Fintech</option>
                <option value="SaaS">SaaS &amp; Cloud</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
            </div>

            {/* Sort Selector */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort alumni mentors"
                className="w-full py-2.5 px-3 text-xs sm:text-sm bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
              >
                <option value="match">Sort by: Best Match Score</option>
                <option value="experience">Sort by: Years Experience</option>
                <option value="sessions">Sort by: Most Sessions Held</option>
                <option value="rating">Sort by: Highest Rating</option>
              </select>
            </div>
          </div>

          {/* Secondary Quick Toggles (Segmented Controls) */}
          <div className="pt-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSelectedFormat('all')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    selectedFormat === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-neutral-600 hover:text-slate-900'
                  }`}
                >
                  All Formats
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('video_chat')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    selectedFormat === 'video_chat'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-neutral-600 hover:text-slate-900'
                  }`}
                >
                  1-on-1 Coffee Chat
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedFormat('async_review')}
                  className={`px-3 py-1 font-medium rounded-md transition-colors ${
                    selectedFormat === 'async_review'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-neutral-600 hover:text-slate-900'
                  }`}
                >
                  Async Portfolio Review
                </button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-700 w-3.5 h-3.5"
                />
                <span>Verified Alumni Only</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={availableSlotsOnly}
                  onChange={(e) => setAvailableSlotsOnly(e.target.checked)}
                  className="rounded text-teal-700 focus:ring-teal-700 w-3.5 h-3.5"
                />
                <span>Has Open Slots</span>
              </label>
            </div>

            <div className="text-slate-500 font-mono tabular-nums">
              Showing {filteredAlumni.length} of {allAlumni.length} mentors
            </div>
          </div>
        </div>

        {/* Alumni Grid */}
        {filteredAlumni.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center max-w-lg mx-auto">
            <p className="text-base font-semibold text-slate-800 mb-1">No alumni mentors found</p>
            <p className="text-xs text-slate-500 mb-4">
              Try widening your search terms or unchecking the "Has Open Slots" filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('all');
                setSelectedFormat('all');
                setVerifiedOnly(false);
                setAvailableSlotsOnly(false);
              }}
              className="px-4 py-2 text-xs font-semibold text-teal-800 bg-neutral-100 rounded-lg hover:bg-neutral-200 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map(({ profile, match }) => {
              const data = profile.alumniData!;
              const isVerified = data.verificationStatus === 'verified';
              const matchScoreColor =
                match.overallScore >= 85
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : match.overallScore >= 70
                  ? 'text-teal-700 bg-teal-50 border-teal-200'
                  : 'text-slate-700 bg-neutral-50 border-neutral-200';

              return (
                <div
                  key={profile.id}
                  className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between hover:border-neutral-300 hover:shadow-sm transition-all"
                >
                  <div>
                    {/* Header Row: Avatar, Info, and Match Pill */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={profile.avatarUrl}
                          alt={profile.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-full object-cover border border-neutral-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="font-bold text-slate-900 text-base leading-tight">
                              {profile.name}
                            </h3>
                            {isVerified && (
                              <span title="Verified Alumnus">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-medium text-slate-700 mt-0.5">{data.currentTitle}</p>
                          <p className="text-xs text-slate-500">{data.company} · {data.industry}</p>
                        </div>
                      </div>

                      {/* Interactive Match Badge */}
                      <button
                        type="button"
                        onClick={() => onOpenMatchModal(profile)}
                        title="Click to view rule-based match breakdown"
                        className={`border px-2.5 py-1 rounded-lg text-xs font-mono font-bold tabular-nums shrink-0 cursor-pointer hover:scale-105 transition-transform ${matchScoreColor}`}
                      >
                        {match.overallScore}% Match
                      </button>
                    </div>

                    {/* Unboxed Metadata (Zero-Pill discipline) */}
                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1 mb-4 pb-3 border-b border-neutral-100">
                      <span>{data.yearsExperience} yrs exp</span>
                      <span aria-hidden="true">·</span>
                      <span>{profile.university} '{String(data.graduationYear).slice(-2)}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">★ {data.ratingAverage.toFixed(1)} ({data.sessionsCompletedCount})</span>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {profile.bio}
                    </p>

                    {/* Overlapping Skills vs Expertise */}
                    <div className="mb-4">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                        Matched &amp; Core Skills
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {data.expertiseSkills.slice(0, 5).map((skill) => {
                          const isOverlap = match.overlappingSkills.some(
                            (s) => s.toLowerCase() === skill.toLowerCase()
                          );
                          return (
                            <span
                              key={skill}
                              className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                                isOverlap
                                  ? 'bg-teal-50 border-teal-200 text-teal-800'
                                  : 'bg-neutral-50 border-neutral-200 text-slate-600'
                              }`}
                            >
                              {isOverlap && '✓ '}
                              {skill}
                            </span>
                          );
                        })}
                        {data.expertiseSkills.length > 5 && (
                          <span className="text-[11px] text-slate-400 py-0.5 px-1">
                            +{data.expertiseSkills.length - 5}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Format and Availability Info */}
                    <div className="text-xs text-slate-500 flex items-center gap-2 mb-6">
                      {data.availableFormats === 'both' ? (
                        <span>Offers 1-on-1 Coffee Chats &amp; Async Reviews</span>
                      ) : data.availableFormats === 'video_chat' ? (
                        <span>Offers 1-on-1 Video Chats</span>
                      ) : (
                        <span>Offers Async Portfolio Reviews</span>
                      )}
                      <span aria-hidden="true">·</span>
                      <span className="text-teal-700 font-medium">
                        {data.availableSlots.length > 0
                          ? `${data.availableSlots.length} open slots`
                          : 'Async queue open'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => onSelectAlumni(profile)}
                      className="py-2 px-3 text-xs font-medium text-slate-700 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-lg transition-colors text-center"
                    >
                      View Profile
                    </button>
                    <button
                      type="button"
                      onClick={() => onRequestMentorship(profile)}
                      className="py-2 px-3 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors text-center shadow-xs"
                    >
                      Request Guidance
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
