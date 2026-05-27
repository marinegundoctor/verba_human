import React, { useState } from "react";
import { Sparkles, Trash2, ArrowRight, FileText, Settings, AlertCircle } from "lucide-react";
import { SAMPLE_TEXTS, SampleText } from "./SampleTexts";
import { AnalysisResult } from "../types";

interface WorkspaceProps {
  onAnalyzeComplete: (result: { text: string; analysis: AnalysisResult; mocked: boolean }) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
  error: string | null;
  setError: (val: string | null) => void;
  initialText: string;
}

export default function Workspace({ 
  onAnalyzeComplete, 
  isLoading, 
  setIsLoading, 
  error, 
  setError,
  initialText 
}: WorkspaceProps) {
  const [text, setText] = useState(initialText);
  const [strength, setStrength] = useState("standard");

  const handleClear = () => {
    setText("");
    setError(null);
  };

  const handleSelectSample = (sample: SampleText) => {
    setText(sample.content);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      setError("Please input or paste some text to analyze first.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text, strength })
      });

      if (!response.ok) {
        throw new Error("Analysis failed. Please check backend connection.");
      }

      const data = await response.json();
      if (data.success) {
        onAnalyzeComplete({
          text,
          analysis: data.analysis,
          mocked: !!data.mocked
        });
      } else {
        throw new Error(data.error || "Analyzing returned an unexpected outcome.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to analyze text. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Title */}
      <div>
        <h2 className="font-serif text-[40px] font-normal text-on-surface tracking-tight leading-none mb-3">
          Workspace <span className="italic">Canvas</span>
        </h2>
        <p className="font-sans text-xs text-on-surface-variant max-w-xl leading-relaxed opacity-85">
          Paste your drafting notes or essays below. We evaluate mechanical uniformities, word predictabilities, and assist in humanizing the cadence with Google Gemini.
        </p>
      </div>

      {/* Preset Selectors */}
      <div className="space-y-3">
        <span className="text-[10px] uppercase tracking-widest font-bold text-on-surface-variant block">
          Select test draft preset
        </span>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_TEXTS.map((sample) => (
            <button
              key={sample.title}
              onClick={() => handleSelectSample(sample)}
              className="px-5 py-4 bg-white hover:bg-surface-low border border-editorial rounded-lg text-left transition-all duration-200 cursor-pointer active:scale-[0.99] hover:shadow-sm"
            >
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs font-serif italic text-on-surface truncate">{sample.title}</span>
              </div>
              <span className="text-[9px] text-[#D94F33] font-bold tracking-widest uppercase px-2 py-0.5 bg-secondary-container rounded">
                {sample.category}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Area Input */}
      <div className="relative bg-white rounded-xl ambient-shadow p-6 border border-editorial flex flex-col gap-4">
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (error) setError(null);
          }}
          disabled={isLoading}
          placeholder="Type or paste standard copy here..."
          className="w-full min-h-[350px] font-sans text-base text-on-surface placeholder-on-surface-variant/40 resize-y border-0 focus:ring-0 outline-none leading-relaxed select-text"
        />

        {/* Workspace controls */}
        <div className="flex flex-wrap items-center justify-between pt-4 border-t border-editorial gap-4 select-none">
          {/* Left: word counter / parameters */}
          <div className="flex items-center gap-3 text-xs text-on-surface-variant font-medium">
            <span>
              Words: <strong className="text-primary font-bold">{text.split(/\s+/).filter(Boolean).length}</strong>
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-secondary opacity-60"></span>
            <span>
              Characters: <strong className="text-primary font-bold">{text.length}</strong>
            </span>
          </div>

          {/* Right: triggers */}
          <div className="flex items-center gap-3">
            {text && (
              <button
                onClick={handleClear}
                disabled={isLoading}
                className="p-2.5 text-on-surface-variant hover:text-secondary hover:bg-secondary-container/40 rounded-full transition-all duration-200 active:scale-90 cursor-pointer"
                title="Clear Workspace"
              >
                <Trash2 className="w-4.5 h-4.5" />
              </button>
            )}

            {/* Strength selector */}
            <div className="flex items-center bg-surface-low p-1 rounded-lg border border-editorial text-xs">
              <button
                onClick={() => setStrength("standard")}
                disabled={isLoading}
                className={`px-3.5 py-1.5 rounded-md font-bold transition-all duration-200 cursor-pointer ${
                  strength === "standard" 
                    ? "bg-white text-on-surface shadow-sm" 
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setStrength("strong")}
                disabled={isLoading}
                className={`px-3.5 py-1.5 rounded-md font-bold transition-all duration-200 cursor-pointer ${
                  strength === "strong" 
                    ? "bg-white text-on-surface shadow-sm" 
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Strong
              </button>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !text.trim()}
              className="bg-primary text-on-primary hover:bg-[#D94F33] disabled:opacity-40 rounded-lg px-6 py-3 font-bold text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-md disabled:cursor-not-allowed hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[1px]"
            >
              {isLoading ? "Analyzing..." : "Analyze Prose"}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Errors or System Notices */}
      {error && (
        <div className="p-4 bg-error-container text-on-error-container rounded-xl flex items-start gap-3 border border-error/10 animate-shake">
          <AlertCircle className="w-5 h-5 text-error mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-bold">Execution Warning</p>
            <p className="font-medium opacity-90">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
