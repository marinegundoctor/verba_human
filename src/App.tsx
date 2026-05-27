import React, { useState, useEffect } from "react";
import { 
  Menu, 
  Sparkles, 
  FileEdit, 
  TrendingUp, 
  Bookmark, 
  LogOut,
  ChevronRight
} from "lucide-react";
import Welcome from "./components/Welcome";
import Workspace from "./components/Workspace";
import AnalyticsView from "./components/AnalyticsView";
import SavedView from "./components/SavedView";
import { AnalysisResult, SavedItem } from "./types";

export default function App() {
  // Authentication State with local persistence
  const [user, setUser] = useState<{ email: string; name: string; avatar: string } | null>(null);

  // Active view: "workspace" | "analytics" | "saved"
  const [activeTab, setActiveTab] = useState<"workspace" | "analytics" | "saved">("workspace");

  // Input text & analysis State
  const [text, setText] = useState("");
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalysisMocked, setIsAnalysisMocked] = useState(false);

  // Loading & Error States
  const [workspaceLoading, setWorkspaceLoading] = useState(false);
  const [workspaceError, setWorkspaceError] = useState<string | null>(null);

  // Saved customizations database
  const [savedItems, setSavedItems] = useState<SavedItem[]>([]);

  // Mobile Menu toggles
  const [showDesktopMenu, setShowDesktopMenu] = useState(true);

  // Load Auth State and Saved Items on Mount
  useEffect(() => {
    const savedAuth = localStorage.getItem("verbahuman_user");
    if (savedAuth) {
      try {
        setUser(JSON.parse(savedAuth));
      } catch (e) {
        localStorage.removeItem("verbahuman_user");
      }
    }

    const savedLibrary = localStorage.getItem("verbahuman_saved");
    if (savedLibrary) {
      try {
        setSavedItems(JSON.parse(savedLibrary));
      } catch (e) {
        console.error("Failed to load local saved state:", e);
      }
    } else {
      // Seed initial dummy item for amazing onboarding demonstration
      const initialSeed: SavedItem[] = [
        {
          id: "seed-1",
          timestamp: "May 27, 2026, 04:11 AM",
          title: "The Tapestry of Tech...",
          originalText: "In conclusion, we must delve into digital complexities to weave an undeniable testament of interconnected tapestry.",
          humanizedText: "Ultimately, understanding how modern technology shifts requires looking at how we build direct, meaningful connections.",
          beforeProbability: 85,
          afterProbability: 6
        }
      ];
      setSavedItems(initialSeed);
      localStorage.setItem("verbahuman_saved", JSON.stringify(initialSeed));
    }
  }, []);

  // Save items helper
  const saveLibraryToStorage = (updatedList: SavedItem[]) => {
    setSavedItems(updatedList);
    localStorage.setItem("verbahuman_saved", JSON.stringify(updatedList));
  };

  const handleLogin = (email: string, name: string, avatar: string) => {
    const userData = { email, name, avatar };
    setUser(userData);
    localStorage.setItem("verbahuman_user", JSON.stringify(userData));
    setActiveTab("workspace");
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("verbahuman_user");
    setActiveTab("workspace");
  };

  const handleAnalyzeComplete = (result: { text: string; analysis: AnalysisResult; mocked: boolean }) => {
    setText(result.text);
    setCurrentAnalysis(result.analysis);
    setIsAnalysisMocked(result.mocked);
    setActiveTab("analytics");
  };

  const handleSaveItem = (item: Omit<SavedItem, "id" | "timestamp">) => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }) + `, ${today.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;

    const newItem: SavedItem = {
      ...item,
      id: "opt-" + Date.now(),
      timestamp: formattedDate
    };

    const updated = [newItem, ...savedItems];
    saveLibraryToStorage(updated);
  };

  const handleRemoveItem = (id: string) => {
    const updated = savedItems.filter(item => item.id !== id);
    saveLibraryToStorage(updated);
  };

  const handleSelectSavedText = (selectedText: string) => {
    setText(selectedText);
    setActiveTab("workspace");
    // Clear old state
    setCurrentAnalysis(null);
  };

  // If user is not logged in, render the beautiful Welcome Screen
  if (!user) {
    return <Welcome onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-32 md:pb-12 bg-background flex flex-col text-on-surface">
      
      {/* TopAppBar Navigation */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 w-full z-40 border-b border-editorial flex justify-between items-center px-6 md:px-12 py-5 select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowDesktopMenu(!showDesktopMenu)}
            className="text-on-surface-variant hover:bg-surface-low rounded-full p-2 transition-all duration-200 active:scale-95 cursor-pointer hidden md:inline-flex"
            title="Toggle Sidebar Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h1 className="font-serif text-[24px] font-normal tracking-tighter text-primary flex items-center gap-1.5 leading-none">
            Verba<span className="italic text-secondary">Human.</span>
          </h1>
        </div>

        {/* User Account Controls */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block select-none">
            <p className="text-xs font-bold text-on-surface leading-none">{user.name}</p>
            <p className="text-[9px] text-on-surface-variant font-medium tracking-wide">{user.email}</p>
          </div>
          
          {/* Sign out indicator */}
          <div className="relative group">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container hover:opacity-85 active:scale-95 transition-all duration-200 cursor-pointer object-cover shadow-sm border border-editorial">
              <img 
                src={user.avatar} 
                alt="User Profile Avatar" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Simple logout popup on hover/click */}
            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-md border border-editorial p-2.5 hidden group-hover:block hover:block select-none w-44 animate-fade-in">
              <button 
                onClick={handleLogout}
                className="w-full text-left text-[10px] uppercase tracking-widest text-on-surface-variant hover:text-secondary hover:bg-secondary-container rounded-md py-2 px-3.5 transition-all flex items-center gap-2 font-bold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Structural Layout Content */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full px-6 md:px-12 py-8 gap-8 relative">
        
        {/* Persistent Desktop Sidebar (Hidden on mobile) */}
        {showDesktopMenu && (
          <aside className="hidden md:flex flex-col w-64 pr-6 shrink-0 border-r border-editorial h-[calc(100vh-140px)] sticky top-24 select-none">
            <div className="space-y-4">
              <button 
                onClick={() => setActiveTab("workspace")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer ${
                  activeTab === "workspace" 
                    ? "bg-primary text-on-primary shadow-sm" 
                    : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileEdit className="w-4 h-4" />
                  <span>Workspace</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
              </button>

              <button 
                onClick={() => {
                  if (currentAnalysis) {
                    setActiveTab("analytics");
                  } else {
                    alert("Run analysis in the workspace first to view analytics metrics.");
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer ${
                  !currentAnalysis ? "opacity-45 cursor-not-allowed" : ""
                } ${
                  activeTab === "analytics" 
                    ? "bg-primary text-on-primary shadow-sm" 
                    : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                }`}
                title={!currentAnalysis ? "Analyze prose to open" : "Detailed breakdown statistics"}
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4" />
                  <span>Analytics</span>
                </div>
                {currentAnalysis ? (
                  <span className="bg-secondary text-white rounded text-[8px] font-bold px-1.5 py-0.5 uppercase shrink-0 tracking-wider">
                    {currentAnalysis.probability}%
                  </span>
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                )}
              </button>

              <button 
                onClick={() => setActiveTab("saved")}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-lg transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer ${
                  activeTab === "saved" 
                    ? "bg-primary text-on-primary shadow-sm" 
                    : "text-on-surface-variant hover:bg-surface-low hover:text-on-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4" />
                  <span>Saved Library</span>
                </div>
                <span className="text-[10px] bg-surface-low text-on-surface-variant font-bold px-2 py-0.5 rounded border border-editorial">
                  {savedItems.length}
                </span>
              </button>
            </div>

            {/* Quote details in sidebar footer */}
            <div className="mt-auto bg-white p-5 rounded-lg border border-editorial space-y-2 select-none">
              <div className="flex items-center gap-1.5 text-secondary">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">Aesthetic Outlook</span>
              </div>
              <p className="text-[11px] leading-relaxed text-on-surface-variant/80 italic font-medium font-serif">
                "There is unmatched value when rhythm, directness, and cadence collide into natural expression."
              </p>
            </div>
          </aside>
        )}

        {/* Dynamic Canvas Area */}
        <main className="flex-1 min-w-0 pr-1">
          {activeTab === "workspace" && (
            <Workspace 
              onAnalyzeComplete={handleAnalyzeComplete}
              isLoading={workspaceLoading}
              setIsLoading={setWorkspaceLoading}
              error={workspaceError}
              setError={setWorkspaceError}
              initialText={text}
            />
          )}

          {activeTab === "analytics" && currentAnalysis && (
            <AnalyticsView 
              text={text}
              analysis={currentAnalysis}
              onBackToWorkspace={() => setActiveTab("workspace")}
              onSave={handleSaveItem}
              isMocked={isAnalysisMocked}
            />
          )}

          {activeTab === "saved" && (
            <SavedView 
              savedItems={savedItems}
              onRemoveItem={handleRemoveItem}
              onSelectText={handleSelectSavedText}
            />
          )}
        </main>

      </div>

      {/* Floating Bottom Nav Menu (Visible exclusively on handhelds) */}
      <nav className="bg-white/90 backdrop-blur-md shadow-[0_-8px_30px_rgb(45,42,38,0.06)] border-t border-surface-container/60 fixed bottom-0 w-full z-50 flex justify-around items-center pb-8 pt-4 rounded-t-2xl md:hidden select-none">
        
        {/* Workspace state Button */}
        <button 
          onClick={() => setActiveTab("workspace")}
          className={`flex flex-col items-center justify-center p-2.5 transition-all duration-200 gap-1 active:scale-95 cursor-pointer ${
            activeTab === "workspace" 
              ? "text-primary scale-105 font-extrabold" 
              : "text-on-surface-variant/75 hover:text-on-surface font-semibold"
          }`}
        >
          <FileEdit className={`w-5 h-5 transition-transform ${activeTab === 'workspace' ? 'scale-110' : ''}`} />
          <span className="text-[11px] font-bold tracking-wide">Workspace</span>
        </button>

        {/* Analytics button with conditional validation alert */}
        <button 
          onClick={() => {
            if (currentAnalysis) {
              setActiveTab("analytics");
            } else {
              alert("Input text and click 'Analyze Prose' in your workspace first!");
            }
          }}
          className={`flex flex-col items-center justify-center p-2.5 transition-all duration-200 gap-1 active:scale-95 cursor-pointer ${
            !currentAnalysis ? "opacity-35" : ""
          } ${
            activeTab === "analytics" 
              ? "text-primary scale-105 font-extrabold" 
              : "text-on-surface-variant/75 hover:text-on-surface font-semibold"
          }`}
        >
          <TrendingUp className={`w-5 h-5 transition-transform ${activeTab === 'analytics' ? 'scale-110' : ''}`} />
          <span className="text-[11px] font-bold tracking-wide">Analytics</span>
        </button>

        {/* Saved Library view selector button */}
        <button 
          onClick={() => setActiveTab("saved")}
          className={`flex flex-col items-center justify-center p-2.5 transition-all duration-200 gap-1 active:scale-95 cursor-pointer ${
            activeTab === "saved" 
              ? "text-primary scale-105 font-extrabold" 
              : "text-on-surface-variant/75 hover:text-on-surface font-semibold"
          }`}
        >
          <div className="relative">
            <Bookmark className={`w-5 h-5 transition-transform ${activeTab === 'saved' ? 'scale-110' : ''}`} />
            {savedItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary text-white text-[9px] font-extrabold flex items-center justify-center rounded-full scale-90 border border-white">
                {savedItems.length}
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold tracking-wide">Saved</span>
        </button>

      </nav>

    </div>
  );
}
