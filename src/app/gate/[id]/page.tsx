'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

type Props = {
  params: { id: string };
};

interface LeadGateField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
}

interface LeadGateData {
  id: string;
  name: string;
  title: string;
  description: string;
  fields: LeadGateField[];
  redirectUrl: string;
  submitText: string;
  theme: {
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
}

export default function LeadGatePage({ params }: Props) {
  const router = useRouter();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leadGate, setLeadGate] = useState<LeadGateData | null>(null);

  // Fetch lead gate configuration from API
  useEffect(() => {
    const fetchLeadGate = async () => {
      try {
        const response = await fetch(`/api/lead-gate/${params.id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('This lead gate form was not found or has been deleted.');
          } else {
            setError('Failed to load the form. Please try again later.');
          }
          return;
        }

        const data = await response.json();
        setLeadGate(data);
      } catch (err) {
        console.error('Error fetching lead gate:', err);
        setError('Failed to load the form. Please check your connection.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchLeadGate();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadGate) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/lead-gate/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitted(true);
        // Redirect after a short delay
        setTimeout(() => {
          window.location.href = leadGate.redirectUrl;
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to submit form. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-electric-cyan" />
          <p className="text-gray-400">Loading form...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !leadGate) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="max-w-md w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Form Not Available</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-electric-cyan text-black font-semibold rounded-lg hover:bg-electric-cyan/90 transition-colors"
          >
            Go to Homepage
          </a>
        </div>
      </div>
    );
  }

  // Success state
  if (submitted) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ backgroundColor: leadGate?.theme?.backgroundColor || '#09090b' }}
      >
        <div className="max-w-md w-full bg-zinc-900 rounded-2xl border border-zinc-800 p-8 text-center">
          <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Success!</h1>
          <p className="text-gray-400">
            Thank you for your submission. Redirecting you now...
          </p>
        </div>
      </div>
    );
  }

  if (!leadGate) return null;

  const theme = leadGate.theme || {
    primaryColor: '#06b6d4',
    backgroundColor: '#09090b',
    textColor: '#ffffff',
    fontFamily: 'Inter',
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 py-12"
      style={{
        backgroundColor: theme.backgroundColor,
        fontFamily: theme.fontFamily,
      }}
    >
      <div className="max-w-md w-full">
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl">
          {/* Header */}
          <div
            className="p-6 text-center"
            style={{ backgroundColor: theme.primaryColor }}
          >
            <h1 className="text-2xl font-bold text-white mb-2">
              {leadGate.title}
            </h1>
            {leadGate.description && (
              <p className="text-white/90 text-sm">
                {leadGate.description}
              </p>
            )}
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {leadGate.fields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    {field.label}
                    {field.required && <span className="text-red-400 ml-1">*</span>}
                  </label>
                  {field.type === 'textarea' ? (
                    <textarea
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-gray-500 focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan outline-none transition-colors resize-none"
                    />
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder}
                      value={formData[field.name] || ''}
                      onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                      className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder:text-gray-500 focus:border-electric-cyan focus:ring-1 focus:ring-electric-cyan outline-none transition-colors"
                    />
                  )}
                </div>
              ))}

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: theme.primaryColor }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  leadGate.submitText || 'Submit'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
          >
            Powered by QR Studio
          </a>
        </div>
      </div>
    </div>
  );
}
