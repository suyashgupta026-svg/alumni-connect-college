import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, Search, ExternalLink, Database, AlertTriangle, UserCheck } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { UserProfile, VerificationStatus } from '../types';

interface AdminVerificationCenterProps {
  currentUser: UserProfile;
  onOpenSqlModal: () => void;
}

export const AdminVerificationCenter: React.FC<AdminVerificationCenterProps> = ({
  currentUser,
  onOpenSqlModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'verified'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectingAlumni, setInspectingAlumni] = useState<UserProfile | null>(null);
  const [verificationNoteInput, setVerificationNoteInput] = useState('');

  const allAlumni = StorageService.getAlumni();
  const allRequests = StorageService.getRequests();

  const filteredAlumni = allAlumni.filter((alum) => {
    const data = alum.alumniData!;
    if (filterStatus !== 'all' && data.verificationStatus !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alum.name.toLowerCase().includes(q) ||
        data.company.toLowerCase().includes(q) ||
        alum.email.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = allAlumni.filter((a) => a.alumniData?.verificationStatus === 'pending').length;
  const verifiedCount = allAlumni.filter((a) => a.alumniData?.verificationStatus === 'verified').length;

  const handleUpdateStatus = (alumniId: string, status: VerificationStatus, note?: string) => {
    StorageService.setVerificationStatus(
      alumniId,
      status,
      note || `Audited & approved by ${currentUser.name} on ${new Date().toLocaleDateString()}`
    );
    setInspectingAlumni(null);
  };

  return (
    <div className="bg-[#FBFBF9] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Protected Coordinator Header */}
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
                <span className="text-xs bg-slate-900 text-white font-semibold px-2 py-0.5 rounded">
                  Administrator &amp; Institutional Coordinator
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {currentUser.bio}
              </p>
              <div className="text-xs text-slate-500 mt-1.5 flex items-center gap-2">
                <span>Institution: <strong>{currentUser.university}</strong></span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-medium">Protected RLS Administrator Session</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSqlModal}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5 text-teal-700" />
              <span>Inspect Supabase RLS Policies</span>
            </button>
          </div>
        </div>

        {/* Security Alert Banner */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 mb-8 flex items-start gap-3 text-xs text-amber-900">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Security &amp; Authorization Guardrail:</span> Verification status is protected and can only be modified by authorized institutional coordinators. In production, this is enforced via database Row Level Security (`CREATE POLICY ... WITH CHECK (auth.jwt() -&gt;&gt; 'role' = 'admin')`).
          </div>
        </div>

        {/* Admin KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Pending Audit Queue</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">{pendingCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Alumni awaiting credential check</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Verified Alumni</p>
            <p className="text-3xl font-extrabold text-emerald-800 mt-2 font-mono tabular-nums">{verifiedCount}</p>
            <p className="text-[11px] text-slate-500 mt-1">Registrar confirmed alumni</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Mentorships</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
              {allRequests.filter((r) => r.status === 'accepted' || r.status === 'pending').length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Ongoing career connections</p>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-xs">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Sessions</p>
            <p className="text-3xl font-extrabold text-slate-900 mt-2 font-mono tabular-nums">
              {allRequests.filter((r) => r.status === 'completed').length}
            </p>
            <p className="text-[11px] text-slate-500 mt-1">Archived university sessions</p>
          </div>
        </div>

        {/* Verification Queue Management */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Alumni Credential Verification Queue</h2>
              <p className="text-xs text-slate-500">
                Audit graduation records, employer emails, and grant verified status badges.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter alumni by name/company..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  All ({allAlumni.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('pending')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterStatus === 'pending' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('verified')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    filterStatus === 'verified' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Verified ({verifiedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Alumni Verification Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Alumnus Name &amp; Email</th>
                  <th className="py-3 px-4">Company &amp; Title</th>
                  <th className="py-3 px-4">Academic Degree</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredAlumni.map((alum) => {
                  const data = alum.alumniData!;
                  const isVerified = data.verificationStatus === 'verified';

                  return (
                    <tr key={alum.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={alum.avatarUrl}
                            alt={alum.name}
                            referrerPolicy="no-referrer"
                            className="w-9 h-9 rounded-full object-cover border border-neutral-300 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{alum.name}</p>
                            <p className="text-slate-500 font-mono text-[11px]">{alum.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{data.currentTitle}</p>
                        <p className="text-slate-500">{data.company} · {data.industry}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-medium text-slate-800">{data.degree} in {data.major}</p>
                        <p className="text-slate-500">Class of {data.graduationYear}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        {isVerified ? (
                          <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                            <span>Pending Review</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => {
                            setInspectingAlumni(alum);
                            setVerificationNoteInput(data.verificationNote || '');
                          }}
                          className="px-3 py-1.5 font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-colors"
                        >
                          {isVerified ? 'Audit Details' : 'Verify Credentials'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Verification Audit Modal */}
      {inspectingAlumni && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Audit Credentials: {inspectingAlumni.name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Verify degree records with university registrar and confirm employment credentials.
            </p>

            <div className="space-y-3.5 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Degree &amp; Major:</span>
                <span className="font-semibold text-slate-900">
                  {inspectingAlumni.alumniData?.degree} in {inspectingAlumni.alumniData?.major}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Class Year:</span>
                <span className="font-semibold text-slate-900">{inspectingAlumni.alumniData?.graduationYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Current Position:</span>
                <span className="font-semibold text-slate-900">
                  {inspectingAlumni.alumniData?.currentTitle} at {inspectingAlumni.alumniData?.company}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Corporate Email:</span>
                <span className="font-mono text-slate-900">{inspectingAlumni.email}</span>
              </div>
              {inspectingAlumni.linkedinUrl && (
                <div className="flex justify-between">
                  <span className="text-slate-500">LinkedIn Profile:</span>
                  <a
                    href={inspectingAlumni.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-800 underline font-medium flex items-center gap-1"
                  >
                    <span>Inspect Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Verification Audit Note / Registrar Reference
              </label>
              <textarea
                rows={2}
                value={verificationNoteInput}
                onChange={(e) => setVerificationNoteInput(e.target.value)}
                placeholder="e.g. Confirmed student registrar records and verified corporate domain @figma.com."
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-teal-700"
              />
            </div>

            <div className="pt-3 border-t border-neutral-200 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => setInspectingAlumni(null)}
                className="px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-neutral-100 rounded-lg"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                {inspectingAlumni.alumniData?.verificationStatus === 'verified' ? (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(inspectingAlumni.id, 'pending', 'Verification revoked for re-audit.')}
                    className="px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors"
                  >
                    Revoke Verification
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(inspectingAlumni.id, 'verified', verificationNoteInput)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve &amp; Grant Verified Badge</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
