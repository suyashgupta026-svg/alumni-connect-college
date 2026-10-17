export type UserRole = 'student' | 'alumni' | 'admin';

export type VerificationStatus = 'verified' | 'pending' | 'unverified';

export type MentorshipFormat = 'video_chat' | 'async_review' | 'both';

export type RequestStatus = 'pending' | 'accepted' | 'declined' | 'completed';

export interface TimeSlot {
  id: string;
  dayOfWeek: string; // e.g. "Tuesday", "Thursday"
  time: string; // e.g. "4:00 PM - 4:30 PM EST"
  isAvailable: boolean;
}

export interface StudentProfileData {
  major: string;
  degreeLevel: string; // e.g. "B.S.", "M.S.", "Ph.D."
  graduationYear: number;
  targetRoles: string[];
  targetIndustries: string[];
  skillsToLearn: string[];
  currentSkills: string[];
  careerGoals: string;
  resumeUrl?: string;
  portfolioUrl?: string;
}

export interface AlumniProfileData {
  currentTitle: string;
  company: string;
  industry: string;
  yearsExperience: number;
  expertiseSkills: string[];
  pastCompanies: string[];
  degree: string;
  major: string;
  graduationYear: number;
  verificationStatus: VerificationStatus;
  verificationNote?: string;
  availableFormats: MentorshipFormat;
  weeklySlotCapacity: number;
  availableSlots: TimeSlot[];
  isAcceptingRequests: boolean;
  mentoringPhilosophy: string;
  ratingAverage: number;
  sessionsCompletedCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  university: string;
  linkedinUrl?: string;
  createdAt: string;
  studentData?: StudentProfileData;
  alumniData?: AlumniProfileData;
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentMajor: string;
  studentTargetRole: string;
  alumniId: string;
  alumniName: string;
  alumniAvatar: string;
  alumniTitle: string;
  alumniCompany: string;
  format: 'video_chat' | 'async_review';
  topic: string;
  message: string;
  targetOutcome: string;
  preferredTimeSlot?: string;
  scheduledTime?: string;
  meetingLink?: string;
  documentUrl?: string;
  status: RequestStatus;
  statusReason?: string;
  mentorFeedback?: string;
  mentorRating?: number;
  studentRating?: number;
  studentTestimonial?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchFactorBreakdown {
  skillsScore: number; // 0-40
  roleScore: number; // 0-30
  industryScore: number; // 0-20
  availabilityScore: number; // 0-10
}

export interface MatchExplanation {
  overallScore: number; // 0-100%
  breakdown: MatchFactorBreakdown;
  reasons: string[];
  overlappingSkills: string[];
  skillGaps: string[];
  roleAlignment: string;
}
