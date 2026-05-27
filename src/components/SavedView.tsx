import React, { useState } from "react";
import { Bookmark, Clock, ArrowRight, Trash2, Copy, Check, FileCheck2, Search, ExternalLink } from "lucide-react";
import { SavedItem } from "../types";

interface SavedViewProps {
  savedItems: SavedItem[];
  onRemoveItem: (id: string) => void;
  onSelectText: (text: string) => void;
}

export default function SavedView({ savedItems, onRemoveItem, onSelectText }: SavedViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = savedItems.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.humanizedText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Editorial Title */}
      <div>
        <h2 className="font-serif text-[40px] font-normal text-on-surface tracking-tight leading-none mb-3">
          Saved <span className="italic">Humanizations</span>
        </h2>
        <p className="font-sans text-xs text-on-surface-variant max-w-xl leading-relaxed opacity-85">
          Access your optimized, humanized copy and historic analysis scores stored locally in your workspace cache.
        </p>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-editorial shadow-sm">
        {/* Search */}
        <div className="relative w-full md:max-w-md flex items-center bg-surface-low rounded-lg px-3 border border-editorial focus-within:border-secondary transition-all">
          <Search className="w-4 h-4 text-on-surface-variant/60" />
          <input
            type="text"
            placeholder="Search saved drafts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent border-none focus:ring-0 outline-none p-2.5 text-xs font-medium placeholder-on-surface-variant/45"
          />
        </div>

        {/* Total counts */}
        <span className="text-[9px] font-bold text-on-surface-variant shrink-0 uppercase tracking-widest bg-surface-low px-4 py-2 rounded-lg border border-editorial">
          Total Items: <strong className="text-secondary font-bold">{filteredItems.length}</strong>
        </span>
      </div>

      {/* Grid List */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-editorial p-12 text-center text-on-surface-variant space-y-3 max-w-lg mx-auto">
          <Bookmark className="w-10 h-10 mx-auto text-secondary/70 stroke-[1.5]" />
          <div className="space-y-1">
            <h4 className="font-serif italic text-base text-on-surface">No saved optimizations found</h4>
            <p className="text-xs text-on-surface-variant/75 font-medium px-4 leading-relaxed">
              If you optimize text inside the Analytics panel, you can save the results back to your library. It makes it easy to track before/after comparisons!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            
            return (
              <div 
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                className="bg-white rounded-xl border border-editorial hover:border-secondary/40 transition-all duration-300 overflow-hidden cursor-pointer select-none relative"
              >
                {/* Accordion header item details */}
                <div className="p-5 flex flex-wrap items-center justify-between gap-4 select-none">
                  <div className="space-y-1.5 flex-1 min-w-[280px]">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif italic text-sm text-on-surface truncate pr-2">{item.title}</h4>
                      <div className="flex items-center gap-1.5 shrink-0 bg-secondary-container/50 px-2 py-0.5 rounded text-[9px] text-secondary font-bold uppercase tracking-wider">
                        <FileCheck2 className="w-3 h-3" />
                        AI Score: {item.beforeProbability}% → {item.afterProbability}%
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-[9px] text-on-surface-variant font-semibold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectText(item.originalText);
                      }}
                      className="px-3.5 py-1.5 rounded-lg hover:bg-[#D94F33] hover:text-white border border-editorial text-[9px] font-bold uppercase tracking-widest text-on-surface transition-all active:scale-95 cursor-pointer flex items-center gap-1"
                      title="Load this draft back into your canvas workspace"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Rewrite
                    </button>

                    <button
                      onClick={(e) => handleCopy(item.id, item.humanizedText, e)}
                      className="p-2 text-on-surface-variant hover:text-secondary rounded-full hover:bg-surface-low transition-all duration-200 active:scale-90 cursor-pointer"
                      title="Copy humanized prose"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-4 h-4 text-secondary scale-110" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.id);
                      }}
                      className="p-2 text-on-surface-variant hover:text-secondary hover:bg-secondary-container rounded-full transition-all duration-200 active:scale-90 cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expanded text content */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-editorial bg-surface-low/30 space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest block">Before Optimization</span>
                        <p className="p-4 rounded-lg bg-white border border-editorial font-sans text-xs text-on-surface-variant/80 h-[150px] overflow-y-auto leading-relaxed overflow-x-hidden">
                          {item.originalText}
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9px] font-bold text-secondary uppercase tracking-widest block">After Optimization (Google Gemini)</span>
                        <p className="p-4 rounded-lg bg-white border border-secondary/30 font-sans text-xs text-on-surface h-[150px] overflow-y-auto leading-relaxed overflow-x-hidden select-text">
                          {item.humanizedText}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
