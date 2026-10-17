import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { UserProfile } from '../types';

interface ProfileEditorModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const ProfileEditorModal: React.FC<ProfileEditorModalProps> = ({
  currentUser,
  onClose,
  onSuccess,
}) => {
  const isStudent = currentUser.role === 'student';
  const isAlumni = currentUser.role === 'alumni';

  // Common
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [university, setUniversity] = useState(currentUser.university);

  // Student specific
  const [major, setMajor] = useState(currentUser.studentData?.major || '');
  const [degreeLevel, setDegreeLevel] = useState(currentUser.studentData?.degreeLevel || 'B.S.');
  const [targetRolesStr, setTargetRolesStr] = useState(
    (currentUser.studentData?.targetRoles || []).join(', ')
  );
  const [targetIndustriesStr, setTargetIndustriesStr] = useState(
    (currentUser.studentData?.targetIndustries || []).join(', ')
  );
  const [currentSkillsStr, setCurrentSkillsStr] = useState(
    (currentUser.studentData?.currentSkills || []).join(', ')
  );
  const [skillsToLearnStr, setSkillsToLearnStr] = useState(
    (currentUser.studentData?.skillsToLearn || []).join(', ')
  );
  const [portfolioUrl, setPortfolioUrl] = useState(currentUser.studentData?.portfolioUrl || '');

  // Alumni specific
  const [currentTitle, setCurrentTitle] = useState(currentUser.alumniData?.currentTitle || '');
  const [company, setCompany] = useState(currentUser.alumniData?.company || '');
  const [industry, setIndustry] = useState(currentUser.alumniData?.industry || '');
  const [yearsExperience, setYearsExperience] = useState(currentUser.alumniData?.yearsExperience || 5);
  const [expertiseSkillsStr, setExpertiseSkillsStr] = useState(
    (currentUser.alumniData?.expertiseSkills || []).join(', ')
  );
  const [mentoringPhilosophy, setMentoringPhilosophy] = useState(
    currentUser.alumniData?.mentoringPhilosophy || ''
  );
  const [weeklySlotCapacity, setWeeklySlotCapacity] = useState(
    currentUser.alumniData?.weeklySlotCapacity || 2
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isStudent) {
      StorageService.updateUserProfile(currentUser.id, {
        name,
        bio,
        university,
        studentData: {
          ...currentUser.studentData!,
          major,
          degreeLevel,
          targetRoles: targetRolesStr.split(',').map((s) => s.trim()).filter(Boolean),
          targetIndustries: targetIndustriesStr.split(',').map((s) => s.trim()).filter(Boolean),
          currentSkills: currentSkillsStr.split(',').map((s) => s.trim()).filter(Boolean),
          skillsToLearn: skillsToLearnStr.split(',').map((s) => s.trim()).filter(Boolean),
          portfolioUrl,
        },
      });
    } else if (isAlumni) {
      StorageService.updateUserProfile(currentUser.id, {
        name,
        bio,
        university,
        alumniData: {
          ...currentUser.alumniData!,
          currentTitle,
          company,
          industry,
          yearsExperience: Number(yearsExperience),
          expertiseSkills: expertiseSkillsStr.split(',').map((s) => s.trim()).filter(Boolean),
          mentoringPhilosophy,
          weeklySlotCapacity: Number(weeklySlotCapacity),
        },
      });
    } else {
      StorageService.updateUserProfile(currentUser.id, {
        name,
        bio,
        university,
      });
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Edit {isStudent ? 'Student Career Profile' : isAlumni ? 'Alumni Mentoring Profile' : 'Administrator Profile'}
            </h2>
            <p className="text-xs text-slate-500">
              Updates directly refine your compatibility scores and match calculations.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
              Bio Summary
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
            />
          </div>

          {/* Student Fields */}
          {isStudent && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Major
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Degree Level
                  </label>
                  <input
                    type="text"
                    value={degreeLevel}
                    onChange={(e) => setDegreeLevel(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Target Roles (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Frontend Engineer, Full-Stack Engineer, Product Engineer"
                  value={targetRolesStr}
                  onChange={(e) => setTargetRolesStr(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Target Industries (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Developer Tools, Fintech, SaaS"
                  value={targetIndustriesStr}
                  onChange={(e) => setTargetIndustriesStr(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Current Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Tailwind CSS, Git"
                  value={currentSkillsStr}
                  onChange={(e) => setCurrentSkillsStr(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Skills You Want to Learn (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Cloud Architecture, System Design, GraphQL, CI/CD"
                  value={skillsToLearnStr}
                  onChange={(e) => setSkillsToLearnStr(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Portfolio / GitHub URL
                </label>
                <input
                  type="url"
                  placeholder="https://maya-dev-portfolio.example.com"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              </div>
            </>
          )}

          {/* Alumni Fields */}
          {isAlumni && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Current Title
                  </label>
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => setCurrentTitle(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
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
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Industry Sector
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(Number(e.target.value))}
                    className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Expertise Skills (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="React, TypeScript, Cloud Architecture, System Design"
                  value={expertiseSkillsStr}
                  onChange={(e) => setExpertiseSkillsStr(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Mentoring Philosophy
                </label>
                <textarea
                  rows={2}
                  value={mentoringPhilosophy}
                  onChange={(e) => setMentoringPhilosophy(e.target.value)}
                  className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              </div>
            </>
          )}

          {/* Actions */}
          <div className="pt-3 border-t border-neutral-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 font-medium text-slate-700 hover:bg-neutral-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
