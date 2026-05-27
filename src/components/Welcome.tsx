import React, { useState } from "react";
import { LogIn, Mail, Sparkles, Check } from "lucide-react";

interface WelcomeProps {
  onLogin: (email: string, name: string, avatar: string) => void;
  userEmail?: string;
}

export default function Welcome({ onLogin, userEmail = "rustyadixon@gmail.com" }: WelcomeProps) {
  const [typedEmail, setTypedEmail] = useState(userEmail);
  const [typedName, setTypedName] = useState("Rusty Dixon");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleGoogleSignIn = () => {
    onLogin(
      userEmail, 
      "Rusty Dixon", 
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBu8QpGMZyYTqSfgiFnk9Z_w6xihB3P95y45cC73lTqBG4bU-R0HTDC3esIJ5m5aocICOMwJnLaTiKwY2h06m1ftg2xqQoUWkIjhpLhRu3vMcQXIim6s1QhrDstwmpXZWzRNkfATQPIuoMvpPsXu0gbW3kieMJhkGrf3jgDvdiWDjdaIyQ7T5xJw05W_hapqpg2JN88voqWs6vp8YrQGvQfTpuUwSU-E_FWY0sAjyw1gz0YC1eBBm0IR6Xt6gCfpUw7K_3bkzjJM_U"
    );
  };

  const handleEmailSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedEmail.trim()) return;
    const computedName = typedName.trim() || typedEmail.split("@")[0];
    onLogin(
      typedEmail,
      computedName,
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBu8QpGMZyYTqSfgiFnk9Z_w6xihB3P95y45cC73lTqBG4bU-R0HTDC3esIJ5m5aocICOMwJnLaTiKwY2h06m1ftg2xqQoUWkIjhpLhRu3vMcQXIim6s1QhrDstwmpXZWzRNkfATQPIuoMvpPsXu0gbW3kieMJhkGrf3jgDvdiWDjdaIyQ7T5xJw05W_hapqpg2JN88voqWs6vp8YrQGvQfTpuUwSU-E_FWY0sAjyw1gz0YC1eBBm0IR6Xt6gCfpUw7K_3bkzjJM_U"
    );
  };

  return (
    <div className="relative min-h-[max(884px,100vh)] w-full flex flex-col items-center justify-center overflow-hidden bg-background px-6 py-12 select-none">
      {/* Abstract Background Graphic */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none flex justify-center items-center">
        <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-[#c9e7cc] via-[#faf9f5] to-[#ffddb9] blur-3xl opacity-3 transition-transform duration-1000 transform -translate-y-1/4 translate-x-1/4"></div>
        <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#e3e2df] via-[#faf9f5] to-[#e5e2e1] blur-3xl opacity-2 transition-transform duration-1000 transform translate-y-1/3 -translate-x-1/3"></div>
      </div>

      <div className="z-10 w-full max-w-md flex flex-col items-center text-center">
        {/* Logo/Wordmark */}
        <div className="inline-flex items-center gap-2 mb-4 px-3.5 py-1.5 bg-white rounded-full border border-editorial transform hover:scale-[1.02] transition-transform duration-300">
          <span className="w-2 h-2 bg-secondary rounded-full"></span>
          <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-on-surface-variant">Editorial Suite 2026</span>
        </div>
        
        <h1 className="font-serif text-[56px] font-normal leading-none tracking-tight text-primary mb-4">
          Verba<span className="italic">Human</span>
        </h1>
        
        {/* Value Proposition */}
        <p className="font-sans text-sm text-on-surface-variant mb-8 max-w-[290px] leading-relaxed opacity-80">
          Humanize your writing with the power of Google Gemini.
        </p>

        {/* Interactive login card */}
        <div className="w-full bg-white rounded-xl ambient-shadow p-8 flex flex-col items-center gap-6 transition-all duration-300 hover:shadow-lg border border-editorial">
          <p className="text-xs font-bold text-on-surface-variant w-full text-left uppercase tracking-widest mb-1">
            {showEmailForm ? "Create Account" : "Get Started"}
          </p>

          {!showEmailForm ? (
            <>
              {/* Simulated Google Sign-In Button */}
              <button 
                onClick={handleGoogleSignIn}
                className="w-full bg-white border border-surface-dim hover:border-on-surface-variant rounded-full py-3.5 px-6 flex items-center justify-center gap-3 hover:bg-surface-low transition-all duration-200 active:scale-[0.98] shadow-sm cursor-pointer"
              >
                <div className="w-5 h-5 flex items-center justify-center bg-[#f4f4f0] rounded-full">
                  <span className="text-xs font-extrabold text-primary">G</span>
                </div>
                <span className="text-sm font-semibold text-primary">
                  Sign in with Google
                </span>
              </button>

              <div className="w-full flex items-center justify-center gap-4 my-1 opacity-60">
                <div className="h-px bg-surface-dim flex-1"></div>
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Or</span>
                <div className="h-px bg-surface-dim flex-1"></div>
              </div>

              {/* Alternative Action */}
              <button 
                onClick={() => setShowEmailForm(true)}
                className="w-full bg-primary text-on-primary rounded-full py-3.5 px-6 font-semibold text-sm hover:bg-neutral-800 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Mail className="w-4 h-4" />
                Sign up with Email
              </button>
            </>
          ) : (
            <form onSubmit={handleEmailSignInSubmit} className="w-full flex flex-col gap-4">
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rusty Dixon"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 placeholder-on-surface-variant/50 border border-transparent focus:border-on-surface transition-all text-sm outline-none font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wide">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={typedEmail}
                  onChange={(e) => setTypedEmail(e.target.value)}
                  className="w-full bg-surface-low rounded-xl px-4 py-3 placeholder-on-surface-variant/50 border border-transparent focus:border-on-surface transition-all text-sm outline-none font-medium"
                />
              </div>

              <div className="mt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full bg-primary text-on-primary rounded-full py-3.5 px-6 font-semibold text-sm hover:bg-neutral-800 transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors py-1 underline underline-offset-4"
                >
                  Back to options
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer / Legal */}
        <div className="mt-8 flex flex-col items-center gap-2 text-center opacity-70">
          <p className="text-[11px] leading-relaxed text-on-surface-variant max-w-[270px]">
            By signing in, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
