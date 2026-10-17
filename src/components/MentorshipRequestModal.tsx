import React, { useState } from 'react';
import { X, Video, FileText, Calendar, CheckCircle2, AlertCircle, Send } from 'lucide-react';
import { StorageService } from '../lib/storage';
import { UserProfile } from '../types';

interface MentorshipRequestModalProps {
  alumni: UserProfile;
  currentUser: UserProfile;
  initialFormat?: 'video_chat' | 'async_review';
  onClose: () => void;
  onSuccess: () => void;
}

export const MentorshipRequestModal: React.FC<MentorshipRequestModalProps> = ({
  alumni,
  currentUser,
  initialFormat = 'video_chat',
  onClose,
  onSuccess,
}) => {
  const data = alumni.alumniData!;
  
  // Decide allowable formats based on mentor settings
  const allowsVideo = data.availableFormats === 'both' || data.availableFormats === 'video_chat';
  const allowsAsync = data.availableFormats === 'both' || data.availableFormats === 'async_review';

  const defaultFormat = allowsVideo && initialFormat === 'video_chat' 
    ? 'video_chat' 
    : allowsAsync 
    ? 'async_review' 
    : 'video_chat';

  const [format, setFormat] = useState<'video_chat' | 'async_review'>(defaultFormat);
  const [topic, setTopic] = useState('Career Trajectory & Technical Foundations');
  const [message, setMessage] = useState('');
  const [targetOutcome, setTargetOutcome] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(
    data.availableSlots[0] ? `${data.availableSlots[0].dayOfWeek} (${data.availableSlots[0].time})` : ''
  );
  const [documentUrl, setDocumentUrl] = useState(
    currentUser.studentData?.portfolioUrl || currentUser.studentData?.resumeUrl || ''
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!topic.trim()) errs.topic = 'Please provide a discussion topic.';
    if (!message.trim() || message.length < 25) {
      errs.message = 'Please write a thoughtful note of at least 25 characters.';
    }
    if (!targetOutcome.trim()) {
      errs.targetOutcome = 'Please describe your desired target outcome.';
    }
    if (format === 'async_review' && !documentUrl.trim()) {
      errs.documentUrl = 'Please provide a valid URL to your resume or portfolio.';
    }
    if (format === 'video_chat' && !selectedSlot.trim() && data.availableSlots.length > 0) {
      errs.selectedSlot = 'Please choose an available calendar time slot.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      try {
        StorageService.createRequest({
          studentId: currentUser.id,
          alumniId: alumni.id,
          format,
          topic,
          message,
          targetOutcome,
          preferredTimeSlot: format === 'video_chat' ? selectedSlot : undefined,
          documentUrl: format === 'async_review' ? documentUrl : undefined,
        });

        setIsSubmitting(false);
        onSuccess();
      } catch (err) {
        setIsSubmitting(false);
        setErrors({ general: 'Failed to create request. Please try again.' });
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-neutral-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img
              src={alumni.avatarUrl}
              alt={alumni.name}
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full object-cover border border-neutral-300 shrink-0"
            />
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Request Guidance from {alumni.name}
              </h2>
              <p className="text-xs text-slate-600">
                {data.currentTitle} at {data.company} · Class of '{String(data.graduationYear).slice(-2)}
              </p>
            </div>
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
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.general}</span>
            </div>
          )}

          {/* Mentorship Format Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Mentorship Interaction Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!allowsVideo}
                onClick={() => setFormat('video_chat')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  format === 'video_chat'
                    ? 'border-teal-700 bg-teal-50/70 text-slate-900 ring-1 ring-teal-700'
                    : allowsVideo
                    ? 'border-neutral-200 bg-white hover:border-neutral-300 text-slate-700'
                    : 'border-neutral-200 bg-neutral-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <Video className="w-4 h-4 text-teal-700" />
                  <span>30-min Video Chat</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Live conversation over Google Meet with calendar invite.
                </p>
              </button>

              <button
                type="button"
                disabled={!allowsAsync}
                onClick={() => setFormat('async_review')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  format === 'async_review'
                    ? 'border-teal-700 bg-teal-50/70 text-slate-900 ring-1 ring-teal-700'
                    : allowsAsync
                    ? 'border-neutral-200 bg-white hover:border-neutral-300 text-slate-700'
                    : 'border-neutral-200 bg-neutral-100 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2 font-semibold text-xs mb-1">
                  <FileText className="w-4 h-4 text-teal-700" />
                  <span>Async Critique</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Submit link for detailed written feedback &amp; rubric.
                </p>
              </button>
            </div>
          </div>

          {/* Video Chat Specific: Slot Selection */}
          {format === 'video_chat' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Preferred Weekly Time Slot
              </label>
              {data.availableSlots.length > 0 ? (
                <select
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className={`w-full py-2 px-3 text-xs bg-neutral-50 border rounded-lg text-slate-800 focus:outline-none focus:border-teal-700 ${
                    errors.selectedSlot ? 'border-red-400' : 'border-neutral-200'
                  }`}
                >
                  {data.availableSlots.map((slot) => (
                    <option
                      key={slot.id}
                      value={`${slot.dayOfWeek} (${slot.time})`}
                    >
                      {slot.dayOfWeek} · {slot.time}
                    </option>
                  ))}
                  <option value="Flexible / Other Time">Flexible / Propose Other Time</option>
                </select>
              ) : (
                <input
                  type="text"
                  placeholder="Propose 2 preferred times (e.g., Weekday afternoons after 4 PM EST)"
                  value={selectedSlot}
                  onChange={(e) => setSelectedSlot(e.target.value)}
                  className="w-full py-2 px-3 text-xs bg-neutral-50 border border-neutral-200 rounded-lg text-slate-800"
                />
              )}
              {errors.selectedSlot && (
                <p className="text-[11px] text-red-600 mt-1">{errors.selectedSlot}</p>
              )}
            </div>
          )}

          {/* Async Review Specific: Document URL */}
          {format === 'async_review' && (
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                Portfolio or Resume Document URL *
              </label>
              <input
                type="url"
                placeholder="https://my-portfolio.dev or Google Drive / Figma / GitHub link"
                value={documentUrl}
                onChange={(e) => setDocumentUrl(e.target.value)}
                className={`w-full py-2 px-3 text-xs bg-neutral-50 border rounded-lg text-slate-800 focus:outline-none focus:border-teal-700 ${
                  errors.documentUrl ? 'border-red-400' : 'border-neutral-200'
                }`}
              />
              {errors.documentUrl && (
                <p className="text-[11px] text-red-600 mt-1">{errors.documentUrl}</p>
              )}
            </div>
          )}

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Primary Discussion Focus *
            </label>
            <input
              type="text"
              placeholder="e.g. System design interview preparation, or frontend architecture at scale"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className={`w-full py-2 px-3 text-xs bg-neutral-50 border rounded-lg text-slate-800 focus:outline-none focus:border-teal-700 ${
                errors.topic ? 'border-red-400' : 'border-neutral-200'
              }`}
            />
            {errors.topic && (
              <p className="text-[11px] text-red-600 mt-1">{errors.topic}</p>
            )}
          </div>

          {/* Message to Mentor */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Personal Note to {alumni.name} *
            </label>
            <p className="text-[11px] text-slate-500 mb-1.5">
              Introduce yourself, why you chose them, and specific questions you have prepared.
            </p>
            <textarea
              rows={4}
              placeholder="Hi David! I'm an undergraduate junior in CS preparing for technical engineering interviews. I noticed your experience scaling systems at Datadog..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`w-full py-2.5 px-3 text-xs bg-neutral-50 border rounded-lg text-slate-800 focus:outline-none focus:border-teal-700 ${
                errors.message ? 'border-red-400' : 'border-neutral-200'
              }`}
            />
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-1">
              <span>{message.length} characters (min 25)</span>
              {errors.message && (
                <span className="text-red-600">{errors.message}</span>
              )}
            </div>
          </div>

          {/* Desired Target Outcome */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              What does a successful session look like for you? *
            </label>
            <input
              type="text"
              placeholder="e.g. Clear roadmap for practicing distributed systems and feedback on my capstone project architecture."
              value={targetOutcome}
              onChange={(e) => setTargetOutcome(e.target.value)}
              className={`w-full py-2 px-3 text-xs bg-neutral-50 border rounded-lg text-slate-800 focus:outline-none focus:border-teal-700 ${
                errors.targetOutcome ? 'border-red-400' : 'border-neutral-200'
              }`}
            />
            {errors.targetOutcome && (
              <p className="text-[11px] text-red-600 mt-1">{errors.targetOutcome}</p>
            )}
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting Request...' : 'Send Mentorship Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
