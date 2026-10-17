import React, { useState } from 'react';
import { X, GraduationCap, Briefcase, UserCheck, ShieldCheck, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { UserProfile, UserRole } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [role, setRole] = useState<'student' | 'alumni'>('student');

  // Sign In state
  const [signInEmail, setSignInEmail] = useState('');
  const [signInError, setSignInError] = useState('');

  // Sign Up state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('Stanford University');
  const [bio, setBio] = useState('');

  // Student specific
  const [major, setMajor] = useState('Computer Science');
  const [degreeLevel, setDegreeLevel] = useState('B.S.');
  const [graduationYear, setGraduationYear] = useState(2027);
  const [targetRoles, setTargetRoles] = useState('Software Engineer, Frontend Developer');
  const [targetIndustries, setTargetIndustries] = useState('Developer Tools, SaaS');
  const [currentSkills, setCurrentSkills] = useState('React, TypeScript, Python');
  const [skillsToLearn, setSkillsToLearn] = useState('Distributed Systems, Cloud Architecture');

  // Alumni specific
  const [currentTitle, setCurrentTitle] = useState('Senior Software Engineer');
  const [company, setCompany] = useState('Google');
  const [industry, setIndustry] = useState('Developer Tools');
  const [yearsExperience, setYearsExperience] = useState(5);
  const [alumniMajor, setAlumniMajor] = useState('Computer Science');
  const [alumniGradYear, setAlumniGradYear] = useState(2019);
  const [expertiseSkills, setExpertiseSkills] = useState('React, TypeScript, System Design, Cloud Architecture');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const demoAccounts = [
    { role: 'student', name: 'Maya Lin', email: 'maya.lin@university.edu', desc: 'CS Junior · Student Persona' },
    { role: 'alumni', name: 'David Chen', email: 'david.chen@datadog.com', desc: 'Sr. Eng Lead @ Datadog · Verified Alumnus' },
    { role: 'admin', name: 'Dr. Sarah Jenkins', email: 'sarah.jenkins@university.edu', desc: 'Director of Career Services · Admin Persona' },
  ];

  const handleQuickSignIn = (emailAddress: string) => {
    const allUsers = StorageService.getUsers();
    const found = allUsers.find((u) => u.email.toLowerCase() === emailAddress.toLowerCase());
    if (found) {
      StorageService.setCurrentUserId(found.id);
      onSuccess(found);
    } else {
      setSignInError('Account not found in local repository.');
    }
  };

  const handleCustomSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim()) {
      setSignInError('Please enter your university or corporate email.');
      return;
    }
    const allUsers = StorageService.getUsers();
    const found = allUsers.find((u) => u.email.toLowerCase() === signInEmail.trim().toLowerCase());
    if (found) {
      StorageService.setCurrentUserId(found.id);
      onSuccess(found);
    } else {
      setSignInError('No account found with this email. You can register a new one or select a demo account.');
    }
  };

  const validateSignUp = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Full name is required.';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid institutional or corporate email required.';
    if (!university.trim()) errs.university = 'University affiliation required.';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignUp()) return;

    if (role === 'student') {
      const newUser = StorageService.registerUser({
        name,
        email,
        role: 'student',
        avatarUrl: '/src/assets/images/avatar_student_maya_1792252668700.jpg',
        bio: bio.trim() || `Undergraduate student at ${university} studying ${major}.`,
        university,
        studentData: {
          major,
          degreeLevel,
          graduationYear: Number(graduationYear),
          targetRoles: targetRoles.split(',').map((s) => s.trim()).filter(Boolean),
          targetIndustries: targetIndustries.split(',').map((s) => s.trim()).filter(Boolean),
          currentSkills: currentSkills.split(',').map((s) => s.trim()).filter(Boolean),
          skillsToLearn: skillsToLearn.split(',').map((s) => s.trim()).filter(Boolean),
          careerGoals: `Aspiring to secure impactful junior software roles in ${targetIndustries}.`,
        },
      });
      onSuccess(newUser);
    } else {
      const newUser = StorageService.registerUser({
        name,
        email,
        role: 'alumni',
        avatarUrl: '/src/assets/images/avatar_mentor_lead_1792252666837.jpg',
        bio: bio.trim() || `${currentTitle} at ${company}. Alumni Class of ${alumniGradYear}.`,
        university,
        alumniData: {
          currentTitle,
          company,
          industry,
          yearsExperience: Number(yearsExperience),
          degree: 'B.S.',
          major: alumniMajor,
          graduationYear: Number(alumniGradYear),
          verificationStatus: 'pending', // Starts as pending until coordinator approves
          verificationNote: 'Submitted new registration; pending registrar & corporate directory audit.',
          availableFormats: 'both',
          weeklySlotCapacity: 2,
          isAcceptingRequests: true,
          mentoringPhilosophy: 'Happy to help students prepare for real-world technical and product careers.',
          ratingAverage: 5.0,
          sessionsCompletedCount: 0,
          availableSlots: [
            { id: 'slot-new-1', dayOfWeek: 'Wednesday', time: '5:00 PM - 5:30 PM EST', isAvailable: true },
          ],
          expertiseSkills: expertiseSkills.split(',').map((s) => s.trim()).filter(Boolean),
          pastCompanies: [],
        },
      });
      onSuccess(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-neutral-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header with Mode Toggle */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50 flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {authMode === 'signin' ? 'Sign In to Alumify' : 'Join Alumify Community'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {authMode === 'signin'
                ? 'Select a demonstration persona or enter your university email.'
                : 'Create your student or alumni profile with verified academic credentials.'}
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

        {/* Tab Switcher */}
        <div className="px-6 pt-4 bg-white border-b border-neutral-200 flex items-center gap-6 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setSignInError('');
            }}
            className={`pb-3 transition-colors ${
              authMode === 'signin'
                ? 'text-teal-800 border-b-2 border-teal-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Sign In / Quick Access
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('signup');
              setSignInError('');
            }}
            className={`pb-3 transition-colors ${
              authMode === 'signup'
                ? 'text-teal-800 border-b-2 border-teal-800'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Register New Account &amp; Onboard
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {authMode === 'signin' ? (
            <div className="space-y-6">
              {/* Quick Persona Access Cards */}
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2">
                  One-Click Demo Personas
                </label>
                <div className="space-y-2">
                  {demoAccounts.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => handleQuickSignIn(acc.email)}
                      className="w-full p-3 rounded-xl border border-neutral-200 hover:border-teal-700 hover:bg-teal-50/40 text-left transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <div>
                        <p className="font-bold text-slate-900 text-xs group-hover:text-teal-900">{acc.name}</p>
                        <p className="text-[11px] text-slate-500">{acc.desc}</p>
                      </div>
                      <span className="text-xs font-semibold text-teal-800 group-hover:translate-x-0.5 transition-transform">
                        Sign In →
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="border-t border-neutral-200 w-full" />
                <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-medium">Or</span>
              </div>

              {/* Custom Email Sign In */}
              <form onSubmit={handleCustomSignIn} className="space-y-3">
                {signInError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{signInError}</span>
                  </div>
                )}
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    University / Corporate Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. maya.lin@university.edu"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-700"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                >
                  Sign In with Email
                </button>
              </form>
            </div>
          ) : (
            /* Sign Up & Onboarding Flow */
            <form onSubmit={handleSignUpSubmit} className="space-y-4">
              {/* Role Selection */}
              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Select Your Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'student'
                        ? 'border-teal-700 bg-teal-50 text-slate-900 ring-1 ring-teal-700 font-medium'
                        : 'border-neutral-200 bg-white text-slate-600 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <GraduationCap className="w-4 h-4 text-teal-800" />
                      <span>Student</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Seeking career coffee chats &amp; resume reviews</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('alumni')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === 'alumni'
                        ? 'border-teal-700 bg-teal-50 text-slate-900 ring-1 ring-teal-700 font-medium'
                        : 'border-neutral-200 bg-white text-slate-600 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-0.5">
                      <Briefcase className="w-4 h-4 text-teal-800" />
                      <span>Alumnus / Mentor</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Giving back &amp; advising enrolled students</p>
                  </button>
                </div>
              </div>

              {/* Shared Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                    required
                  />
                  {formErrors.name && <p className="text-[10px] text-red-600 mt-0.5">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Email (.edu or corporate) *
                  </label>
                  <input
                    type="email"
                    placeholder="alex@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                    required
                  />
                  {formErrors.email && <p className="text-[10px] text-red-600 mt-0.5">{formErrors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  University Affiliation
                </label>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              </div>

              {/* Student Onboarding Fields */}
              {role === 'student' && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Major
                      </label>
                      <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Grad Year
                      </label>
                      <input
                        type="number"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(Number(e.target.value))}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Target Career Roles (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={targetRoles}
                      onChange={(e) => setTargetRoles(e.target.value)}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Skills You Want to Master (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={skillsToLearn}
                      onChange={(e) => setSkillsToLearn(e.target.value)}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                    />
                  </div>
                </>
              )}

              {/* Alumni Onboarding Fields */}
              {role === 'alumni' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Current Job Title
                      </label>
                      <input
                        type="text"
                        value={currentTitle}
                        onChange={(e) => setCurrentTitle(e.target.value)}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                        Years Experience
                      </label>
                      <input
                        type="number"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(Number(e.target.value))}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Advisory Expertise Skills
                    </label>
                    <input
                      type="text"
                      value={expertiseSkills}
                      onChange={(e) => setExpertiseSkills(e.target.value)}
                      className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                className="w-full py-2.5 font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors cursor-pointer shadow-xs mt-2"
              >
                Complete Onboarding &amp; Enter Alumify
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
