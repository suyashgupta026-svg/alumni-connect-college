import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AlumniDirectory } from './components/AlumniDirectory';
import { StudentDashboard } from './components/StudentDashboard';
import { AlumniDashboard } from './components/AlumniDashboard';
import { AdminVerificationCenter } from './components/AdminVerificationCenter';
import { AlumniProfileModal } from './components/AlumniProfileModal';
import { MatchBreakdownModal } from './components/MatchBreakdownModal';
import { MentorshipRequestModal } from './components/MentorshipRequestModal';
import { ProfileEditorModal } from './components/ProfileEditorModal';
import { SupabaseSqlModal } from './components/SupabaseSqlModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { AuthModal } from './components/AuthModal';
import { StorageService } from './lib/storage';
import { UserProfile } from './types';
import { ShieldCheck, Heart, Sparkles, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => StorageService.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>('landing');

  // Modals state
  const [selectedAlumniForProfile, setSelectedAlumniForProfile] = useState<UserProfile | null>(null);
  const [selectedAlumniForMatch, setSelectedAlumniForMatch] = useState<UserProfile | null>(null);
  const [requestingAlumni, setRequestingAlumni] = useState<UserProfile | null>(null);
  const [preferredFormat, setPreferredFormat] = useState<'video_chat' | 'async_review'>('video_chat');
  const [showProfileEditor, setShowProfileEditor] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Subscribe to storage changes
  useEffect(() => {
    const unsubscribe = StorageService.subscribe(() => {
      setCurrentUser(StorageService.getCurrentUser());
    });
    return unsubscribe;
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartRequest = (alumni: UserProfile, format?: 'video_chat' | 'async_review') => {
    // If current user is not student, suggest switching or switch to Maya Lin
    if (currentUser.role !== 'student') {
      StorageService.setCurrentUserId('student-1');
      triggerToast('Switched to Student persona (Maya Lin) to submit mentorship request.');
    }
    setPreferredFormat(format || 'video_chat');
    setRequestingAlumni(alumni);
  };

  const handleRequestSuccess = () => {
    setRequestingAlumni(null);
    setCurrentView('student-dashboard');
    triggerToast('Mentorship request successfully submitted! Track progress below.');
  };

  return (
    <div className="min-h-screen bg-[#FBFBF9] flex flex-col font-sans text-slate-900 selection:bg-teal-700 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-neutral-700 flex items-center gap-2.5 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Contract Navigation */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'how-it-works') {
            setShowHowItWorksModal(true);
          } else {
            setCurrentView(view);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenSqlModal={() => setShowSqlModal(true)}
        onOpenProfileModal={() => setShowProfileEditor(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={(view) => {
              if (view === 'how-it-works') {
                setShowHowItWorksModal(true);
              } else {
                setCurrentView(view);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onSelectAlumni={(alumni) => setSelectedAlumniForProfile(alumni)}
          />
        )}

        {currentView === 'directory' && (
          <AlumniDirectory
            currentUser={currentUser}
            onSelectAlumni={(alumni) => setSelectedAlumniForProfile(alumni)}
            onOpenMatchModal={(alumni) => setSelectedAlumniForMatch(alumni)}
            onRequestMentorship={(alumni) => handleStartRequest(alumni)}
          />
        )}

        {currentView === 'student-dashboard' && (
          <StudentDashboard
            currentUser={currentUser}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenProfileEditor={() => setShowProfileEditor(true)}
          />
        )}

        {currentView === 'alumni-dashboard' && (
          <AlumniDashboard
            currentUser={currentUser}
            onOpenProfileEditor={() => setShowProfileEditor(true)}
          />
        )}

        {currentView === 'admin-verification' && (
          <AdminVerificationCenter
            currentUser={currentUser}
            onOpenSqlModal={() => setShowSqlModal(true)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded bg-teal-800 text-white flex items-center justify-center font-bold text-xs">
                A
              </div>
              <span className="font-bold text-slate-900 text-sm">Alumify</span>
              <span aria-hidden="true" className="text-neutral-300">·</span>
              <span>University Alumni Mentorship Platform</span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-slate-600">
              <button
                type="button"
                onClick={() => {
                  setCurrentView('directory');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-slate-900 transition-colors"
              >
                Browse Mentors
              </button>
              <button
                type="button"
                onClick={() => setShowHowItWorksModal(true)}
                className="hover:text-slate-900 transition-colors"
              >
                Matching Methodology
              </button>
              <button
                type="button"
                onClick={() => setShowSqlModal(true)}
                className="hover:text-slate-900 transition-colors"
              >
                PostgreSQL RLS Schema
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentView('admin-verification');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="hover:text-slate-900 transition-colors"
              >
                Institutional Portal
              </button>
            </div>

            <div className="text-slate-400 font-mono text-[11px]">
              &copy; {new Date().getFullYear()} Alumify. Higher-Ed Trust &amp; Safety.
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedAlumniForProfile && (
        <AlumniProfileModal
          alumni={selectedAlumniForProfile}
          onClose={() => setSelectedAlumniForProfile(null)}
          onOpenMatchModal={(alumni) => setSelectedAlumniForMatch(alumni)}
          onRequestMentorship={(alumni, fmt) => handleStartRequest(alumni, fmt)}
        />
      )}

      {selectedAlumniForMatch && (
        <MatchBreakdownModal
          alumni={selectedAlumniForMatch}
          currentUser={currentUser}
          onClose={() => setSelectedAlumniForMatch(null)}
          onRequestMentorship={(alumni) => handleStartRequest(alumni)}
        />
      )}

      {requestingAlumni && (
        <MentorshipRequestModal
          alumni={requestingAlumni}
          currentUser={currentUser}
          initialFormat={preferredFormat}
          onClose={() => setRequestingAlumni(null)}
          onSuccess={handleRequestSuccess}
        />
      )}

      {showProfileEditor && (
        <ProfileEditorModal
          currentUser={currentUser}
          onClose={() => setShowProfileEditor(false)}
          onSuccess={() => {
            setShowProfileEditor(false);
            triggerToast('Profile updated successfully!');
          }}
        />
      )}

      {showSqlModal && (
        <SupabaseSqlModal onClose={() => setShowSqlModal(false)} />
      )}

      {showHowItWorksModal && (
        <HowItWorksModal
          onClose={() => setShowHowItWorksModal(false)}
          onExploreMentors={() => {
            setCurrentView('directory');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(user) => {
            setShowAuthModal(false);
            if (user.role === 'student') {
              setCurrentView('student-dashboard');
            } else if (user.role === 'alumni') {
              setCurrentView('alumni-dashboard');
            } else {
              setCurrentView('admin-verification');
            }
            triggerToast(`Signed in as ${user.name} (${user.role})!`);
          }}
        />
      )}
    </div>
  );
}
