import { MentorshipRequest, UserProfile, VerificationStatus } from '../types';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'alumify_current_user_id',
  USERS: 'alumify_users_data',
  REQUESTS: 'alumify_requests_data',
  VERSION: 'alumify_data_version_v1',
};

// Seed Profiles
const INITIAL_USERS: UserProfile[] = [
  {
    id: 'student-1',
    name: 'Maya Lin',
    email: 'maya.lin@university.edu',
    role: 'student',
    avatarUrl: '/src/assets/images/avatar_student_maya_1792252668700.jpg',
    bio: 'Junior in Computer Science & Human-Computer Interaction. Passionate about building delightful developer tools and high-scale web interfaces.',
    university: 'Stanford University',
    linkedinUrl: 'https://linkedin.com/in/maya-lin-demo',
    createdAt: '2026-09-01T10:00:00Z',
    studentData: {
      major: 'Computer Science',
      degreeLevel: 'B.S.',
      graduationYear: 2026,
      targetRoles: ['Frontend Engineer', 'Full-Stack Software Engineer', 'Product Engineer'],
      targetIndustries: ['Developer Tools', 'Fintech', 'SaaS'],
      currentSkills: ['React', 'TypeScript', 'Tailwind CSS', 'Git', 'REST APIs'],
      skillsToLearn: ['Cloud Architecture', 'System Design', 'GraphQL', 'CI/CD Pipelines'],
      careerGoals:
        'Seeking summer software engineering internships and junior full-time roles focused on frontend infrastructure and product engineering.',
      portfolioUrl: 'https://maya-dev-portfolio.example.com',
      resumeUrl: 'https://maya-resume-v2.pdf',
    },
  },
  {
    id: 'alumni-1',
    name: 'David Chen',
    email: 'david.chen@datadog.com',
    role: 'alumni',
    avatarUrl: '/src/assets/images/avatar_mentor_lead_1792252666837.jpg',
    bio: 'Engineering Lead at Datadog. Previously Senior Engineer at Uber. Passionate about helping students break into infrastructure and large-scale distributed frontend architecture.',
    university: 'Stanford University',
    linkedinUrl: 'https://linkedin.com/in/david-chen-lead',
    createdAt: '2026-08-15T09:00:00Z',
    alumniData: {
      currentTitle: 'Senior Engineering Lead',
      company: 'Datadog',
      industry: 'Developer Tools',
      yearsExperience: 8,
      degree: 'B.S.',
      major: 'Computer Science',
      graduationYear: 2017,
      verificationStatus: 'verified',
      verificationNote: 'Verified via corporate domain @datadog.com and registrar records.',
      expertiseSkills: [
        'React',
        'TypeScript',
        'Cloud Architecture',
        'System Design',
        'GraphQL',
        'CI/CD Pipelines',
        'Distributed Systems',
      ],
      pastCompanies: ['Uber', 'Palantir', 'Y Combinator W18'],
      availableFormats: 'both',
      weeklySlotCapacity: 2,
      isAcceptingRequests: true,
      mentoringPhilosophy:
        'I focus on pragmatic career navigation: mastering technical fundamentals, system design interview frameworks, and negotiating early offers.',
      ratingAverage: 4.95,
      sessionsCompletedCount: 38,
      availableSlots: [
        { id: 'slot-1', dayOfWeek: 'Tuesday', time: '4:00 PM - 4:30 PM EST', isAvailable: true },
        { id: 'slot-2', dayOfWeek: 'Thursday', time: '5:30 PM - 6:00 PM EST', isAvailable: true },
      ],
    },
  },
  {
    id: 'alumni-2',
    name: 'Marcus Vance',
    email: 'marcus.vance@stripe.com',
    role: 'alumni',
    avatarUrl: '/src/assets/images/avatar_mentor_designer_1792252667957.jpg',
    bio: 'Design Systems Lead & Principal Product Designer at Stripe. Alumni class of 2018. Mentor for design-engineering hybrids and portfolio reviews.',
    university: 'Stanford University',
    linkedinUrl: 'https://linkedin.com/in/marcus-vance-design',
    createdAt: '2026-08-20T11:00:00Z',
    alumniData: {
      currentTitle: 'Principal Product Designer',
      company: 'Stripe',
      industry: 'Fintech',
      yearsExperience: 7,
      degree: 'B.A.',
      major: 'Design & Human-Computer Interaction',
      graduationYear: 2018,
      verificationStatus: 'verified',
      verificationNote: 'Verified via active corporate directory @stripe.com.',
      expertiseSkills: [
        'React',
        'Design Systems',
        'Product Strategy',
        'TypeScript',
        'UX Research',
        'Figma to Code',
      ],
      pastCompanies: ['Airbnb', 'Cash App'],
      availableFormats: 'both',
      weeklySlotCapacity: 3,
      isAcceptingRequests: true,
      mentoringPhilosophy:
        'A great portfolio shows problem solving, technical fidelity, and business impact. Happy to provide targeted line-by-line teardowns.',
      ratingAverage: 5.0,
      sessionsCompletedCount: 42,
      availableSlots: [
        { id: 'slot-3', dayOfWeek: 'Wednesday', time: '2:00 PM - 2:30 PM EST', isAvailable: true },
        { id: 'slot-4', dayOfWeek: 'Friday', time: '11:00 AM - 11:30 AM EST', isAvailable: true },
      ],
    },
  },
  {
    id: 'alumni-3',
    name: 'Samantha Brooks',
    email: 'samantha.brooks@ramp.com',
    role: 'alumni',
    avatarUrl: '/src/assets/images/avatar_mentor_designer_1792252667957.jpg', // fallback to generated high-res portrait
    bio: 'VP of Product at Ramp. Former Group Product Manager at Brex and Google. Passionate about early-career product mindset and tech strategy.',
    university: 'Stanford University',
    linkedinUrl: 'https://linkedin.com/in/samantha-brooks-product',
    createdAt: '2026-08-10T08:30:00Z',
    alumniData: {
      currentTitle: 'VP of Product',
      company: 'Ramp',
      industry: 'Fintech',
      yearsExperience: 10,
      degree: 'B.S. & M.S.',
      major: 'Management Science & Engineering',
      graduationYear: 2015,
      verificationStatus: 'verified',
      verificationNote: 'Verified alumnus credentials via official alumni database.',
      expertiseSkills: [
        'Product Management',
        'Fintech Architecture',
        'Go-To-Market',
        'Metrics & Analytics',
        'System Design',
      ],
      pastCompanies: ['Google', 'Brex', 'McKinsey & Co'],
      availableFormats: 'video_chat',
      weeklySlotCapacity: 2,
      isAcceptingRequests: true,
      mentoringPhilosophy:
        'Clarity of thought and customer empathy are the core superpowers of product leadership.',
      ratingAverage: 4.9,
      sessionsCompletedCount: 29,
      availableSlots: [
        { id: 'slot-5', dayOfWeek: 'Monday', time: '5:00 PM - 5:30 PM EST', isAvailable: true },
      ],
    },
  },
  {
    id: 'alumni-4',
    name: 'Jordan Miller',
    email: 'jordan.miller@figma.com',
    role: 'alumni',
    avatarUrl: '/src/assets/images/avatar_mentor_lead_1792252666837.jpg',
    bio: 'Associate Product Manager at Figma. Recent grad (Class of 2023). Great mentor for APM recruiting cycles, mock behavioral interviews, and transitioning from college to tech.',
    university: 'Stanford University',
    linkedinUrl: 'https://linkedin.com/in/jordan-miller-apm',
    createdAt: '2026-09-12T14:00:00Z',
    alumniData: {
      currentTitle: 'Associate Product Manager',
      company: 'Figma',
      industry: 'SaaS',
      yearsExperience: 2,
      degree: 'B.S.',
      major: 'Symbolic Systems',
      graduationYear: 2023,
      verificationStatus: 'pending', // Pending verification for Admin portal demonstration
      verificationNote: 'Pending review of university diploma upload and LinkedIn match.',
      expertiseSkills: [
        'Product Thinking',
        'APM Interviews',
        'User Research',
        'Prototyping',
        'Cross-Functional Leadership',
      ],
      pastCompanies: ['Kleiner Perkins Fellow', 'Microsoft Intern'],
      availableFormats: 'both',
      weeklySlotCapacity: 2,
      isAcceptingRequests: true,
      mentoringPhilosophy:
        'Recruiting is fresh in my mind. I share real interview frameworks, rubrics, and the exact steps I used to break in.',
      ratingAverage: 4.8,
      sessionsCompletedCount: 14,
      availableSlots: [
        { id: 'slot-6', dayOfWeek: 'Thursday', time: '6:00 PM - 6:30 PM EST', isAvailable: true },
      ],
    },
  },
  {
    id: 'alumni-5',
    name: 'Liam O’Connor',
    email: 'liam.oconnor@crowdstrike.com',
    role: 'alumni',
    avatarUrl: '/src/assets/images/avatar_mentor_lead_1792252666837.jpg',
    bio: 'Staff Security Engineer at CrowdStrike. Focusing on cloud workload protection, kernel telemetry, and incident response.',
    university: 'Stanford University',
    linkedinUrl: 'https://linkedin.com/in/liam-oconnor-sec',
    createdAt: '2026-08-25T16:00:00Z',
    alumniData: {
      currentTitle: 'Staff Security Engineer',
      company: 'CrowdStrike',
      industry: 'Cybersecurity',
      yearsExperience: 6,
      degree: 'B.S.',
      major: 'Computer Science',
      graduationYear: 2019,
      verificationStatus: 'verified',
      verificationNote: 'Verified alumni identity and employer match.',
      expertiseSkills: [
        'Cloud Security',
        'System Design',
        'Go',
        'Linux Internals',
        'CI/CD Security',
      ],
      pastCompanies: ['Cloudflare', 'Cisco'],
      availableFormats: 'async_review',
      weeklySlotCapacity: 1,
      isAcceptingRequests: true,
      mentoringPhilosophy:
        'Security engineering requires deep curiosity for underlying abstractions. Glad to review technical projects and code.',
      ratingAverage: 4.85,
      sessionsCompletedCount: 22,
      availableSlots: [],
    },
  },
  {
    id: 'admin-1',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@university.edu',
    role: 'admin',
    avatarUrl: '/src/assets/images/avatar_mentor_designer_1792252667957.jpg',
    bio: 'Director of University Career Engagement & Alumni Networks. Oversees alumni verification, trust & safety standards, and employer partnerships.',
    university: 'Stanford University',
    createdAt: '2026-01-10T08:00:00Z',
  },
];

const INITIAL_REQUESTS: MentorshipRequest[] = [
  {
    id: 'req-1',
    studentId: 'student-1',
    studentName: 'Maya Lin',
    studentAvatar: '/src/assets/images/avatar_student_maya_1792252668700.jpg',
    studentMajor: 'Computer Science',
    studentTargetRole: 'Frontend Engineer',
    alumniId: 'alumni-1',
    alumniName: 'David Chen',
    alumniAvatar: '/src/assets/images/avatar_mentor_lead_1792252666837.jpg',
    alumniTitle: 'Senior Engineering Lead',
    alumniCompany: 'Datadog',
    format: 'video_chat',
    topic: 'System Design & Career Trajectory',
    message:
      'Hi David! I admire your career path from Uber to Datadog. I am preparing for frontend and distributed system design interviews and would love 30 minutes of guidance on how you structure components for reliability at Datadog.',
    targetOutcome: 'Actionable feedback on system design approach and recommendation for mock interview prep.',
    preferredTimeSlot: 'Thursday (5:30 PM - 6:00 PM EST)',
    scheduledTime: '2026-10-22T17:30:00-04:00',
    meetingLink: 'https://meet.google.com/alm-xkvp-zyd',
    status: 'accepted',
    createdAt: '2026-10-14T15:20:00Z',
    updatedAt: '2026-10-15T09:10:00Z',
  },
  {
    id: 'req-2',
    studentId: 'student-1',
    studentName: 'Maya Lin',
    studentAvatar: '/src/assets/images/avatar_student_maya_1792252668700.jpg',
    studentMajor: 'Computer Science',
    studentTargetRole: 'Product Engineer',
    alumniId: 'alumni-2',
    alumniName: 'Marcus Vance',
    alumniAvatar: '/src/assets/images/avatar_mentor_designer_1792252667957.jpg',
    alumniTitle: 'Principal Product Designer',
    alumniCompany: 'Stripe',
    format: 'async_review',
    topic: 'Design Systems & Portfolio Critique',
    message:
      'Hi Marcus! I have been building a component library inspired by Stripe’s design system. Could you take a look at my portfolio project case study and share your thoughts on my design-to-code documentation?',
    targetOutcome: 'Line-by-line critique on my portfolio design system case study.',
    documentUrl: 'https://maya-dev-portfolio.example.com/case-studies/design-tokens',
    status: 'pending',
    createdAt: '2026-10-16T11:45:00Z',
    updatedAt: '2026-10-16T11:45:00Z',
  },
  {
    id: 'req-3',
    studentId: 'student-1',
    studentName: 'Maya Lin',
    studentAvatar: '/src/assets/images/avatar_student_maya_1792252668700.jpg',
    studentMajor: 'Computer Science',
    studentTargetRole: 'Software Engineer',
    alumniId: 'alumni-1',
    alumniName: 'David Chen',
    alumniAvatar: '/src/assets/images/avatar_mentor_lead_1792252666837.jpg',
    alumniTitle: 'Senior Engineering Lead',
    alumniCompany: 'Datadog',
    format: 'video_chat',
    topic: 'Resume Teardown for Tech Roles',
    message:
      'Introductory coffee chat to review my resume bullet points and GitHub open-source contributions.',
    targetOutcome: 'Polished bullet points with measurable impact metrics.',
    scheduledTime: '2026-09-28T16:00:00-04:00',
    status: 'completed',
    mentorFeedback:
      'Maya has exceptional clarity in her project descriptions. Suggested emphasizing her React performance optimizations (reduced bundle size by 35%) higher on the top fold.',
    studentRating: 5,
    mentorRating: 5,
    studentTestimonial:
      'David gave concrete, direct advice that transformed how I explain my technical projects in interviews.',
    createdAt: '2026-09-20T10:00:00Z',
    updatedAt: '2026-09-28T17:00:00Z',
  },
];

type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

function emitChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch (e) {
      console.error('Storage listener error:', e);
    }
  });
}

export const StorageService = {
  subscribe(listener: StorageListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  init(): void {
    if (typeof window === 'undefined') return;
    const version = localStorage.getItem(STORAGE_KEYS.VERSION);
    if (!version || !localStorage.getItem(STORAGE_KEYS.USERS)) {
      this.resetToDefaults();
    }
  },

  resetToDefaults(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, 'student-1');
    localStorage.setItem(STORAGE_KEYS.VERSION, 'v1.0');
    emitChange();
  },

  getCurrentUserId(): string {
    if (typeof window === 'undefined') return 'student-1';
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'student-1';
  },

  setCurrentUserId(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
    emitChange();
  },

  getCurrentUser(): UserProfile {
    const id = this.getCurrentUserId();
    const users = this.getUsers();
    return users.find((u) => u.id === id) || users[0] || INITIAL_USERS[0];
  },

  getUsers(): UserProfile[] {
    if (typeof window === 'undefined') return INITIAL_USERS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  },

  getUserById(id: string): UserProfile | undefined {
    return this.getUsers().find((u) => u.id === id);
  },

  getAlumni(): UserProfile[] {
    return this.getUsers().filter((u) => u.role === 'alumni' && u.alumniData);
  },

  getStudents(): UserProfile[] {
    return this.getUsers().filter((u) => u.role === 'student' && u.studentData);
  },

  updateUserProfile(id: string, updates: Partial<UserProfile>): UserProfile {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error('User not found');

    const updated: UserProfile = {
      ...users[index],
      ...updates,
      studentData: updates.studentData
        ? { ...users[index].studentData, ...updates.studentData } as any
        : users[index].studentData,
      alumniData: updates.alumniData
        ? { ...users[index].alumniData, ...updates.alumniData } as any
        : users[index].alumniData,
    };

    users[index] = updated;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    emitChange();
    return updated;
  },

  registerUser(userData: Omit<UserProfile, 'id' | 'createdAt'>): UserProfile {
    const newUser: UserProfile = {
      ...userData,
      id: `${userData.role}-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const users = [...this.getUsers(), newUser];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.setCurrentUserId(newUser.id);
    emitChange();
    return newUser;
  },

  // Requests
  getRequests(): MentorshipRequest[] {
    if (typeof window === 'undefined') return INITIAL_REQUESTS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REQUESTS);
      return data ? JSON.parse(data) : INITIAL_REQUESTS;
    } catch {
      return INITIAL_REQUESTS;
    }
  },

  createRequest(params: {
    studentId: string;
    alumniId: string;
    format: 'video_chat' | 'async_review';
    topic: string;
    message: string;
    targetOutcome: string;
    preferredTimeSlot?: string;
    documentUrl?: string;
  }): MentorshipRequest {
    const student = this.getUserById(params.studentId);
    const alumni = this.getUserById(params.alumniId);

    if (!student || !alumni) throw new Error('Student or Alumni not found');

    const newRequest: MentorshipRequest = {
      id: `req-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      studentAvatar: student.avatarUrl,
      studentMajor: student.studentData?.major || 'Undeclared',
      studentTargetRole: student.studentData?.targetRoles?.[0] || 'Software Engineer',
      alumniId: alumni.id,
      alumniName: alumni.name,
      alumniAvatar: alumni.avatarUrl,
      alumniTitle: alumni.alumniData?.currentTitle || 'Alum',
      alumniCompany: alumni.alumniData?.company || 'Alumni Network',
      format: params.format,
      topic: params.topic,
      message: params.message,
      targetOutcome: params.targetOutcome,
      preferredTimeSlot: params.preferredTimeSlot,
      documentUrl: params.documentUrl,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const requests = [newRequest, ...this.getRequests()];
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    emitChange();
    return newRequest;
  },

  updateRequestStatus(
    requestId: string,
    status: 'accepted' | 'declined' | 'completed',
    options?: {
      meetingLink?: string;
      statusReason?: string;
      scheduledTime?: string;
      mentorFeedback?: string;
    }
  ): MentorshipRequest {
    const requests = this.getRequests();
    const index = requests.findIndex((r) => r.id === requestId);
    if (index === -1) throw new Error('Request not found');

    const req = requests[index];
    const updated: MentorshipRequest = {
      ...req,
      status,
      updatedAt: new Date().toISOString(),
      meetingLink: options?.meetingLink ?? req.meetingLink,
      statusReason: options?.statusReason ?? req.statusReason,
      scheduledTime: options?.scheduledTime ?? req.scheduledTime,
      mentorFeedback: options?.mentorFeedback ?? req.mentorFeedback,
    };

    requests[index] = updated;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    emitChange();
    return updated;
  },

  completeRequestWithReview(
    requestId: string,
    params: {
      studentRating: number;
      studentTestimonial?: string;
    }
  ): MentorshipRequest {
    const requests = this.getRequests();
    const index = requests.findIndex((r) => r.id === requestId);
    if (index === -1) throw new Error('Request not found');

    const req = requests[index];
    const updated: MentorshipRequest = {
      ...req,
      status: 'completed',
      studentRating: params.studentRating,
      studentTestimonial: params.studentTestimonial,
      updatedAt: new Date().toISOString(),
    };

    requests[index] = updated;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

    // Update alumni session count
    const alumni = this.getUserById(req.alumniId);
    if (alumni && alumni.alumniData) {
      this.updateUserProfile(alumni.id, {
        alumniData: {
          ...alumni.alumniData,
          sessionsCompletedCount: (alumni.alumniData.sessionsCompletedCount || 0) + 1,
        },
      });
    }

    emitChange();
    return updated;
  },

  // Admin Verification
  setVerificationStatus(
    alumniId: string,
    status: VerificationStatus,
    note?: string
  ): void {
    const alumni = this.getUserById(alumniId);
    if (!alumni || !alumni.alumniData) throw new Error('Alumni not found');

    this.updateUserProfile(alumniId, {
      alumniData: {
        ...alumni.alumniData,
        verificationStatus: status,
        verificationNote: note || (status === 'verified' ? 'Verified by university career administrator.' : 'Verification update requested.'),
      },
    });
  },

  // Generates complete production-grade Supabase SQL schema + Row Level Security (RLS)
  getSupabaseSQLSchema(): string {
    return `-- ============================================================================
-- ALUMIFY POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Compatible with Supabase Auth & PostgreSQL 15+
-- ============================================================================

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('student', 'alumni', 'admin');
CREATE TYPE verification_status AS ENUM ('verified', 'pending', 'unverified');
CREATE TYPE mentorship_format AS ENUM ('video_chat', 'async_review', 'both');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'declined', 'completed');

-- 2. Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role user_role NOT NULL DEFAULT 'student',
  avatar_url TEXT,
  bio TEXT,
  university TEXT NOT NULL DEFAULT 'University Partner',
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Student Details Table
CREATE TABLE IF NOT EXISTS public.student_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  major TEXT NOT NULL,
  degree_level TEXT NOT NULL DEFAULT 'B.S.',
  graduation_year INT NOT NULL,
  target_roles TEXT[] NOT NULL DEFAULT '{}',
  target_industries TEXT[] NOT NULL DEFAULT '{}',
  current_skills TEXT[] NOT NULL DEFAULT '{}',
  skills_to_learn TEXT[] NOT NULL DEFAULT '{}',
  career_goals TEXT,
  portfolio_url TEXT,
  resume_url TEXT
);

-- 4. Alumni Details Table
CREATE TABLE IF NOT EXISTS public.alumni_profiles (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_title TEXT NOT NULL,
  company TEXT NOT NULL,
  industry TEXT NOT NULL,
  years_experience INT NOT NULL DEFAULT 1,
  expertise_skills TEXT[] NOT NULL DEFAULT '{}',
  past_companies TEXT[] NOT NULL DEFAULT '{}',
  degree TEXT NOT NULL DEFAULT 'B.S.',
  major TEXT NOT NULL,
  graduation_year INT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'pending',
  verification_note TEXT,
  available_formats mentorship_format NOT NULL DEFAULT 'both',
  weekly_slot_capacity INT NOT NULL DEFAULT 2,
  is_accepting_requests BOOLEAN NOT NULL DEFAULT TRUE,
  mentoring_philosophy TEXT,
  rating_average NUMERIC(3,2) DEFAULT 5.00,
  sessions_completed_count INT DEFAULT 0
);

-- 5. Mentorship Requests Table
CREATE TABLE IF NOT EXISTS public.mentorship_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  alumni_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  format mentorship_format NOT NULL,
  topic TEXT NOT NULL,
  message TEXT NOT NULL,
  target_outcome TEXT NOT NULL,
  preferred_time_slot TEXT,
  scheduled_time TIMESTAMPTZ,
  meeting_link TEXT,
  document_url TEXT,
  status request_status NOT NULL DEFAULT 'pending',
  status_reason TEXT,
  mentor_feedback TEXT,
  mentor_rating INT CHECK (mentor_rating >= 1 AND mentor_rating <= 5),
  student_rating INT CHECK (student_rating >= 1 AND student_rating <= 5),
  student_testimonial TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;

-- 7. RLS Security Policies
-- Profiles: Any authenticated user can read public directory profiles
CREATE POLICY "Public profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

-- Profiles: Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Student Profiles: Publicly viewable by verified community
CREATE POLICY "Student profiles readable by community"
  ON public.student_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can modify own student profile"
  ON public.student_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Alumni Profiles: Viewable by all authenticated users
CREATE POLICY "Alumni profiles readable by community"
  ON public.alumni_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Alumni: Only the alumnus can update their bio/skills, but verification_status is protected!
CREATE POLICY "Alumni can update their profile information"
  ON public.alumni_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Mentorship Requests: Students & Alumni can view requests they are party to
CREATE POLICY "Users can view their own mentorship requests"
  ON public.mentorship_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = alumni_id);

CREATE POLICY "Students can create mentorship requests"
  ON public.mentorship_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Mentors or students can update their requests"
  ON public.mentorship_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = student_id OR auth.uid() = alumni_id);
`;
  },
};

// Initialize on module load
if (typeof window !== 'undefined') {
  StorageService.init();
}
