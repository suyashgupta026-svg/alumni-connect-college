import React, { useState } from 'react';
import { ShieldCheck, UserCheck, RefreshCw, Database, Sparkles, ChevronDown, Check, User, Menu, X, LogIn } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenSqlModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAuthModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenSqlModal,
  onOpenProfileModal,
  onOpenAuthModal,
}) => {
  const [showPersonaDropdown, setShowPersonaDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [resetToast, setResetToast] = useState(false);

  const demoPersonas = [
    { id: 'student-1', role: 'student', label: 'Maya Lin (Student)' },
    { id: 'alumni-1', role: 'alumni', label: 'David Chen (Alum · Datadog)' },
    { id: 'alumni-2', role: 'alumni', label: 'Marcus Vance (Alum · Stripe)' },
    { id: 'admin-1', role: 'admin', label: 'Dr. Sarah Jenkins (Admin)' },
  ];

  const handleSwitchPersona = (id: string) => {
    StorageService.setCurrentUserId(id);
    setShowPersonaDropdown(false);
  };

  const handleResetData = () => {
    StorageService.resetToDefaults();
    setResetToast(true);
    setTimeout(() => setResetToast(false), 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      {/* Interactive Demo Mode Sub-banner */}
      <div className="bg-neutral-900 text-neutral-300 text-xs px-4 py-1.5 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-teal-400 font-semibold tracking-wide">DEMO MODE</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 hidden sm:inline">Active persona:</span>
            <div className="relative inline-block">
              <button
                type="button"
                onClick={() => setShowPersonaDropdown(!showPersonaDropdown)}
                className="flex items-center gap-1.5 text-white font-medium hover:text-teal-300 transition-colors cursor-pointer px-1 py-0.5 rounded"
              >
                <span>{currentUser.name}</span>
                <span className="text-neutral-400">({currentUser.role})</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {showPersonaDropdown && (
                <div className="absolute left-0 mt-1.5 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-neutral-200 py-1.5 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                    Switch Test Persona
                  </div>
                  {demoPersonas.map((p) => {
                    const isSelected = p.id === currentUser.id;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSwitchPersona(p.id)}
                        className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-teal-50 text-teal-800 font-medium'
                            : 'hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <span>{p.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                      </button>
                    );
                  })}
                  <div className="border-t border-neutral-100 mt-1 pt-1 px-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPersonaDropdown(false);
                        onOpenAuthModal();
                      }}
                      className="w-full text-left px-2 py-1 text-xs text-teal-800 font-semibold hover:bg-neutral-50 rounded"
                    >
                      + Create Custom Account / Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onOpenSqlModal}
              className="flex items-center gap-1 text-neutral-300 hover:text-teal-300 transition-colors text-xs"
              title="Inspect Supabase PostgreSQL DDL & RLS Policies"
            >
              <Database className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">Supabase RLS Schema</span>
            </button>
            <span aria-hidden="true" className="text-neutral-700">·</span>
            <button
              type="button"
              onClick={handleResetData}
              className="flex items-center gap-1 text-neutral-300 hover:text-amber-300 transition-colors text-xs"
              title="Reset state to initial seed data"
            >
              <RefreshCw className="w-3 h-3 text-neutral-400" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {resetToast && (
        <div className="bg-emerald-600 text-white text-xs py-1 px-4 text-center font-medium animate-fadeIn">
          Application seed data restored to initial state.
        </div>
      )}

      {/* Main Top Bar Contract: Brand Wordmark — 4–5 Nav Links — 1 Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2.5 text-left group cursor-pointer shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-800 text-teal-100 flex items-center justify-center font-bold text-base shadow-sm group-hover:bg-teal-700 transition-colors">
              A
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-800 transition-colors whitespace-nowrap">
              Alumify
            </span>
          </button>

          {/* Zone 2: 4–5 Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              type="button"
              onClick={() => onNavigate('directory')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'directory' ? 'text-teal-800 font-semibold border-b-2 border-teal-800 pb-0.5' : ''
              }`}
            >
              Discover Mentors
            </button>

            {currentUser.role === 'student' && (
              <button
                type="button"
                onClick={() => onNavigate('student-dashboard')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  currentView === 'student-dashboard' ? 'text-teal-800 font-semibold border-b-2 border-teal-800 pb-0.5' : ''
                }`}
              >
                My Requests &amp; Sessions
              </button>
            )}

            {currentUser.role === 'alumni' && (
              <button
                type="button"
                onClick={() => onNavigate('alumni-dashboard')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  currentView === 'alumni-dashboard' ? 'text-teal-800 font-semibold border-b-2 border-teal-800 pb-0.5' : ''
                }`}
              >
                Mentoring Desk
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                type="button"
                onClick={() => onNavigate('admin-verification')}
                className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                  currentView === 'admin-verification' ? 'text-teal-800 font-semibold border-b-2 border-teal-800 pb-0.5' : ''
                }`}
              >
                Verification Center
              </button>
            )}

            <button
              type="button"
              onClick={() => onNavigate('how-it-works')}
              className={`hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'how-it-works' ? 'text-teal-800 font-semibold border-b-2 border-teal-800 pb-0.5' : ''
              }`}
            >
              Matching Rules
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action & Profile Trigger */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-neutral-100 hover:bg-neutral-200/80 rounded-lg transition-colors cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-teal-800" />
              <span>Sign In / Join</span>
            </button>

            <button
              type="button"
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 text-xs rounded-lg border border-neutral-200 hover:border-neutral-300 bg-neutral-50 hover:bg-neutral-100 transition-all text-slate-800 cursor-pointer"
              title="Edit Profile"
            >
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-6 h-6 rounded-full object-cover border border-neutral-300"
              />
              <span className="font-medium hidden sm:inline">{currentUser.name.split(' ')[0]}</span>
            </button>

            {currentUser.role === 'student' ? (
              <button
                type="button"
                onClick={() => onNavigate('directory')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shadow-sm"
              >
                Find a Mentor
              </button>
            ) : currentUser.role === 'alumni' ? (
              <button
                type="button"
                onClick={() => onNavigate('alumni-dashboard')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-teal-800 rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap shadow-sm"
              >
                Inbound Desk
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('admin-verification')}
                className="px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 rounded-lg hover:bg-neutral-800 transition-colors whitespace-nowrap shadow-sm"
              >
                Review Alumni
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-neutral-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-3 space-y-2 text-xs font-medium text-slate-700 shadow-lg animate-fadeIn">
          <button
            type="button"
            onClick={() => {
              onNavigate('directory');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100"
          >
            Discover Mentors
          </button>

          {currentUser.role === 'student' && (
            <button
              type="button"
              onClick={() => {
                onNavigate('student-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100"
            >
              My Requests &amp; Sessions
            </button>
          )}

          {currentUser.role === 'alumni' && (
            <button
              type="button"
              onClick={() => {
                onNavigate('alumni-dashboard');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100"
            >
              Mentoring Desk
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              type="button"
              onClick={() => {
                onNavigate('admin-verification');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100"
            >
              Verification Center
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              onNavigate('how-it-works');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-neutral-100"
          >
            Matching Rules
          </button>

          <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onOpenAuthModal();
                setMobileMenuOpen(false);
              }}
              className="text-teal-800 font-semibold py-1.5"
            >
              Sign In / Switch Account
            </button>
            <button
              type="button"
              onClick={() => {
                onOpenProfileModal();
                setMobileMenuOpen(false);
              }}
              className="text-slate-600 py-1.5"
            >
              Edit Profile
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
