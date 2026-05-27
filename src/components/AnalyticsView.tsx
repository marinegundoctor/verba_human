import React, { useState } from "react";
import { 
  BrainCircuit, 
  Droplet, 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  Target, 
  BarChart4, 
  Sparkles, 
  Copy, 
  Check, 
  Save, 
  ArrowLeft, 
  RefreshCw,
  Lightbulb,
  FileCheck2
} from "lucide-react";
import { AnalysisResult, SavedItem } from "../types";

interface AnalyticsViewProps {
  text: string;
  analysis: AnalysisResult;
  onBackToWorkspace: () => void;
  onSave: (item: Omit<SavedItem, "id" | "timestamp">) => void;
  isMocked: boolean;
}

export default function AnalyticsView({ 
  text, 
  analysis, 
  onBackToWorkspace, 
  onSave,
  isMocked 
}: AnalyticsViewProps) {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult>(analysis);
  const [currentText, setCurrentText] = useState(text);
  
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedText, setOptimizedText] = useState<string | null>(null);
  const [optimizedAnalysis, setOptimizedAnalysis] = useState<AnalysisResult | null>(null);
  
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [optimizationError, setOptimizationError] = useState<string | null>(null);

  const handleBeginOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationError(null);
    setSaved(false);
    
    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text: currentText })
      });

      if (!response.ok) {
        throw new Error("Optimization failed. Please verify API availability.");
      }

      const data = await response.json();
      if (data.success) {
        setOptimizedText(data.humanizedText);
        setOptimizedAnalysis(data.afterAnalysis);
        // Sync before-analysis just in case it updated
        if (data.beforeAnalysis) {
          setCurrentAnalysis(data.beforeAnalysis);
        }
      } else {
        throw new Error(data.error || "Gemini could not optimize the vocabulary.");
      }
    } catch (err: any) {
      setOptimizationError(err.message || "Something went wrong during optimization.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = () => {
    if (!optimizedText) return;
    navigator.clipboard.writeText(optimizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveItem = () => {
    if (!optimizedText || !optimizedAnalysis) return;
    
    // Generate simple title based on first 5 words
    const title = currentText.split(/\s+/).slice(0, 4).join(" ") + "...";
    
    onSave({
      title,
      originalText: currentText,
      humanizedText: optimizedText,
      beforeProbability: currentAnalysis.probability,
      afterProbability: optimizedAnalysis.probability
    });
    
    setSaved(true);
  };

  // Compute color based on probability %
  const getProbabilityColor = (prob: number) => {
    if (prob >= 75) return "text-[#ba1a1a]";
    if (prob >= 40) return "text-amber-600";
    return "text-secondary";
  };

  const getProbabilityBg = (prob: number) => {
    if (prob >= 75) return "bg-[#ffdad6] text-[#93000a]";
    if (prob >= 40) return "bg-[#ffddb9] text-amber-900";
    return "bg-secondary-container text-on-secondary-container";
  };

  // Calculations for Ring Offset
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffsetBefore = circumference - (currentAnalysis.probability / 100) * circumference;
  const strokeDashoffsetAfter = optimizedAnalysis 
    ? circumference - (optimizedAnalysis.probability / 100) * circumference 
    : 0;

  return (
    <div className="space-y-8 animate-fade-in select-none">
      
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-container/50 pb-6">
        <div>
          {isMocked && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-light bg-amber-50 text-amber-800 border border-amber-200/50 text-xs font-bold uppercase mb-2">
              <Lightbulb className="w-3.5 h-3.5" />
              Viewing in Sandbox simulation
            </div>
          )}
          <h2 className="font-serif text-[40px] font-normal text-on-surface tracking-tight leading-none mb-1">
            Analytics <span className="italic">Report</span>
          </h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-xl leading-relaxed">
            Automated characteristics outline and live Google Gemini optimization scores.
          </p>
        </div>

        <button
          onClick={onBackToWorkspace}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-editorial hover:bg-surface-low font-bold text-[10px] tracking-widest uppercase transition-all max-w-max cursor-pointer text-on-surface active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Workspace
        </button>
      </div>

      {/* Main Analysis Display Cards */}
      {!optimizedText ? (
        <>
          {/* Section 1: Pre-Analysis overview */}
          <div className="space-y-4">
            <h3 className="text-[10px] tracking-widest font-bold text-[#D94F33] uppercase pl-1">
              Pre-Analysis State
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Radial Probability gauge */}
              <div className="bg-white rounded-xl ambient-shadow p-6 flex flex-col justify-between border border-editorial">
                <div>
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="p-1.5 bg-surface-low rounded-lg text-on-surface-variant">
                      <BrainCircuit className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="font-bold text-sm text-on-surface">Automated Probability</h4>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium">Likelihood of machine generation.</p>
                </div>

                <div className="flex justify-center items-center py-6">
                  <div className="relative w-36 h-36">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle 
                        className="text-surface-low" 
                        cx="50" 
                        cy="50" 
                        fill="none" 
                        r={radius} 
                        stroke="currentColor" 
                        strokeWidth="8"
                      />
                      <circle 
                        className={`${currentAnalysis.probability >= 50 ? 'text-[#ba1a1a]' : 'text-secondary'}`} 
                        cx="50" 
                        cy="50" 
                        fill="none" 
                        r={radius} 
                        stroke="currentColor" 
                        strokeDasharray={circumference} 
                        strokeDashoffset={strokeDashoffsetBefore} 
                        strokeLinecap="round" 
                        strokeWidth="8" 
                        style={{ transition: "stroke-dashoffset 1s ease-out" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-sans text-3xl font-extrabold text-on-surface">
                        {currentAnalysis.probability}%
                      </span>
                      <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mt-0.5">
                        {currentAnalysis.probability >= 70 ? "High AI Match" : currentAnalysis.probability >= 40 ? "Mixed State" : "Human Written"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stack of Perplexity & Burstiness */}
              <div className="flex flex-col gap-6">
                {/* Perplexity card */}
                <div className="bg-white rounded-xl ambient-shadow p-6 flex-1 flex flex-col justify-center border border-editorial">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplet className="w-4.5 h-4.5 text-secondary" />
                    <h4 className="font-bold text-sm text-on-surface">Perplexity Risk</h4>
                  </div>
                  <div className="mt-2.5 space-y-2">
                    <span className={`inline-block font-bold text-[11px] px-3.5 py-1 rounded-full uppercase tracking-wider ${getProbabilityBg(currentAnalysis.probability)}`}>
                      {currentAnalysis.perplexityRisk}
                    </span>
                    <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                      {currentAnalysis.perplexityRiskDetail}
                    </p>
                  </div>
                </div>

                {/* Burstiness Score */}
                <div className="bg-white rounded-xl ambient-shadow p-6 flex-1 flex flex-col justify-center border border-editorial">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-4.5 h-4.5 text-on-surface-variant" />
                    <h4 className="font-bold text-sm text-on-surface">Burstiness Score</h4>
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="font-sans text-3xl font-extrabold text-on-surface">
                      {currentAnalysis.burstinessScore}
                    </span>
                    <span className="text-xs text-on-surface-variant font-bold">/ 100</span>
                  </div>
                  <p className="text-xs text-on-surface-variant font-medium mt-1 leading-relaxed">
                    {currentAnalysis.burstinessScoreDetail}
                  </p>
                </div>
              </div>

              {/* Identified patterns warnings list */}
              <div className="bg-white rounded-xl ambient-shadow p-6 border border-editorial">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4.5 h-4.5 text-[#ba1a1a]" />
                  <h4 className="font-bold text-sm text-on-surface">Identified Patterns</h4>
                </div>
                <p className="text-xs text-on-surface-variant font-medium mb-4 leading-relaxed">
                  Repetitive or structured AI vocabularies detected:
                </p>
                <div className="space-y-3">
                  {currentAnalysis.identifiedPatterns.map((pattern, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-low border border-surface-container/10">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#ba1a1a] mt-0.5 shrink-0" />
                      <span className="font-sans text-xs font-semibold text-on-surface leading-tight italic">
                        {pattern}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Post-Optimization targets outline */}
          <div className="space-y-4 pt-4">
            <h3 className="text-[10px] tracking-widest font-bold text-on-surface-variant uppercase pl-1">
              Optimization Targets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Target Score */}
              <div className="bg-white rounded-xl ambient-shadow p-6 border border-secondary/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-sm text-on-surface">Target Probability</h4>
                    <span className="bg-secondary-container text-on-secondary-container font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Goal
                    </span>
                  </div>
                  <span className="font-sans text-3xl font-extrabold text-secondary tracking-tight">
                    {currentAnalysis.targetProbability}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant font-medium mt-4 leading-relaxed">
                  Achieve a score indicating highly probable fluent human authorship.
                </p>
              </div>

              {/* Perplexity increase goals */}
              <div className="bg-white rounded-xl ambient-shadow p-6 border border-editorial">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="w-4.5 h-4.5 text-secondary" />
                  <h4 className="font-bold text-sm text-on-surface">Perplexity Variance</h4>
                </div>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="font-sans text-3xl font-extrabold text-on-surface">
                    {currentAnalysis.perplexityVariance}
                  </span>
                  <span className="text-xs text-on-surface-variant font-bold">improvement</span>
                </div>
                <div className="w-full bg-surface-low rounded-full h-2 mt-4 overflow-hidden border border-surface-dim/40">
                  <div className="bg-secondary h-full rounded-full transition-all duration-300" style={{ width: "64%" }} />
                </div>
                <p className="text-xs text-on-surface-variant font-medium mt-3 leading-relaxed">
                  Draft broad, highly natural sentence spectrums and rhythm choices.
                </p>
              </div>

              {/* Rhythm / Sentence Diversity chart */}
              <div className="bg-white rounded-xl ambient-shadow p-6 border border-editorial">
                <div className="flex items-center gap-2 mb-3">
                  <BarChart4 className="w-4.5 h-4.5 text-on-surface-variant" />
                  <h4 className="font-bold text-sm text-on-surface">Length Diversity</h4>
                </div>
                {/* Visual Chart from specs */}
                <div className="flex items-end gap-1.5 h-16 mt-2 mb-3 px-1">
                  {currentAnalysis.lengthDiversity.map((height, idx) => (
                    <div 
                      key={idx} 
                      className="flex-1 bg-surface-container rounded-t-lg transition-all duration-300 hover:bg-secondary" 
                      style={{ height: `${height}%` }}
                      title={`Length diversity segment ${idx + 1}`}
                    />
                  ))}
                </div>
                <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
                  Introducing strong rhythmic variations from punchy ideas into descriptives.
                </p>
              </div>

            </div>

            {/* Optimize submit trigger */}
            <div className="mt-8 flex flex-col items-center justify-center gap-4">
              <button
                onClick={handleBeginOptimization}
                disabled={isOptimizing}
                className="bg-primary text-on-primary font-bold text-[10px] tracking-widest uppercase px-8 py-4 rounded-lg hover:bg-[#D94F33] active:scale-95 transition-all shadow-md flex items-center gap-2.5 cursor-pointer hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[1px]"
              >
                {isOptimizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Humanizing Prose...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Begin Optimization
                  </>
                )}
              </button>
              
              {isOptimizing && (
                <p className="text-xs text-on-surface-variant font-bold tracking-wide uppercase animate-pulse">
                  Gemini rewrite underway. Analyzing new structural rhythm...
                </p>
              )}

              {optimizationError && (
                <p className="text-xs text-error font-bold tracking-wide bg-error-container/40 border border-error/5 px-4 py-2 rounded-xl">
                  {optimizationError}
                </p>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Results Comparison Screen AFTER Begin Optimization */
        <div className="space-y-8 animate-fade-in-up">
          
          {/* Back Action */}
          <button 
            onClick={() => {
              setOptimizedText(null);
              setOptimizedAnalysis(null);
            }}
            className="text-[10px] font-bold text-on-surface-variant hover:text-primary transition-all flex items-center gap-1.5 uppercase tracking-widest cursor-pointer bg-white px-5 py-2.5 rounded-lg border border-editorial shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Clear Comparison
          </button>

          {/* Side-by-Side before/after analysis report */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* COLUMN 1: Original text state */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-editorial pb-2">
                <span className="text-[10px] tracking-widest font-bold text-on-surface-variant uppercase">
                  Original Text State
                </span>
                <span className="text-xs font-bold px-3 py-1 bg-surface-lowest border border-editorial rounded-lg text-on-surface">
                  Probability: <strong className="text-[#ba1a1a] font-bold">{currentAnalysis.probability}%</strong>
                </span>
              </div>
              
              {/* Text Card scrollable */}
              <div className="bg-surface-low border border-editorial rounded-xl p-6 h-[280px] overflow-y-auto font-sans text-sm text-on-surface leading-relaxed opacity-75 select-text">
                {currentText}
              </div>

              {/* original metrics parameters recap */}
              <div className="bg-white rounded-xl border border-surface-container p-4 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface-variant">Burstiness Score:</span>
                  <span className="font-bold text-on-surface">{currentAnalysis.burstinessScore} / 100</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface-variant">Uniformity Level:</span>
                  <span className="font-bold text-[#ba1a1a]">{currentAnalysis.perplexityRisk}</span>
                </div>
                <div className="text-xs space-y-1 pt-1 border-t border-surface-low">
                  <span className="font-bold text-on-surface-variant block uppercase text-[10px] tracking-wide">Key clichés spotted:</span>
                  <ul className="list-disc pl-4 space-y-1 text-on-surface-variant italic">
                    {currentAnalysis.identifiedPatterns.slice(0, 2).map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* COLUMN 2: Optimized writing! */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-editorial pb-2">
                <span className="text-[10px] tracking-widest font-bold text-secondary uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                  Optimized Clean Copy
                </span>
                <span className="text-xs font-bold px-3 py-1 bg-secondary-container text-on-secondary-container rounded-lg flex items-center gap-1 shadow-sm">
                  <FileCheck2 className="w-3.5 h-3.5" />
                  Probability: <strong className="font-bold">{optimizedAnalysis?.probability}%</strong>
                </span>
              </div>

              {/* Optimized text copy-paste target */}
              <div className="bg-white border-2 border-secondary/25 shadow-md rounded-xl p-6 h-[280px] overflow-y-auto font-sans text-sm text-on-surface leading-relaxed select-text relative group">
                {optimizedText}
              </div>

              {/* New metrics report details */}
              {optimizedAnalysis && (
                <div className="bg-white rounded-xl border-2 border-secondary/20 p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-on-surface-variant">New Burstiness:</span>
                    <span className="font-bold text-secondary">{optimizedAnalysis.burstinessScore} / 100</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-on-surface-variant">Perplexity Shift:</span>
                    <span className="font-bold text-secondary bg-secondary-container/40 px-2.5 py-0.5 rounded-full text-[10px] uppercase">
                      {optimizedAnalysis.perplexityRisk}
                    </span>
                  </div>
                  <div className="text-xs space-y-1 pt-2 border-t border-surface-low">
                    <span className="font-bold text-on-surface-variant block uppercase text-[10px] tracking-wide">Flow enhancements:</span>
                    <ul className="list-disc pl-4 space-y-1 text-secondary font-semibold">
                      {optimizedAnalysis.identifiedPatterns.slice(0, 3).map((p, idx) => (
                        <li key={idx} className="leading-tight">{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Action Row */}
          <div className="pt-6 flex flex-wrap gap-4 items-center justify-center border-t border-editorial">
            <button
              onClick={handleCopy}
              className="px-6 py-3.5 rounded-lg border border-editorial bg-white hover:bg-surface-low font-bold text-[10px] tracking-widest uppercase transition-all duration-200 cursor-pointer flex items-center gap-2 text-on-surface shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-secondary scale-110" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-on-surface-variant" />
                  Copy Humanized Text
                </>
              )}
            </button>

            <button
              onClick={handleSaveItem}
              disabled={saved}
              className={`px-8 py-3.5 rounded-lg font-bold text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center gap-2.5 cursor-pointer shadow-md ${
                saved 
                  ? "bg-secondary text-white cursor-default opacity-90 shadow-none"
                  : "bg-primary text-on-primary hover:bg-[#D94F33] hover:shadow-lg hover:translate-y-[-1px] active:translate-y-[1px]"
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  Saved to Library
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Optimization Result
                </>
              )}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
