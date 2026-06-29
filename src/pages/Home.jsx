import { useNavigate } from "react-router-dom";
import { PieChart, Flame, Sparkles, ArrowRight } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const handleSeeExample = () => {
    navigate("/analyze");
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] bg-[#e0e5ec] text-[#2d3748] flex flex-col items-center justify-between overflow-hidden">
      {/* CSS moving grid background - subtle for neumorphism */}
      <style>{`
        @keyframes move-grid {
          0% { background-position: 0 0; }
          100% { background-position: 40px 40px; }
        }
        .animated-grid {
          background-size: 40px 40px;
          background-image: 
            linear-gradient(to right, rgba(124, 58, 237, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(124, 58, 237, 0.02) 1px, transparent 1px);
          animation: move-grid 24s linear infinite;
        }
      `}</style>

      <div className="absolute inset-0 animated-grid pointer-events-none z-0" />

      {/* Hero Section */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 max-w-3xl mx-auto pt-20 pb-16 space-y-8">
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] text-xs font-bold text-[#7C3AED] select-none animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>Resume Auditor v2.0</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#2d3748] leading-tight select-none">
          Your Resume, <br />
          <span className="bg-linear-to-r from-[#7C3AED] to-[#5b21b6] bg-clip-text text-transparent">
            Brutally Honest
          </span>
        </h1>

        {/* Subheadline */}
        <p className="max-w-xl mx-auto text-base sm:text-lg text-[#5a6a85] font-semibold leading-relaxed">
          AI-powered analysis that tells you exactly what's wrong — and fixes it.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full sm:w-auto pt-4">
          <button
            onClick={() => navigate("/analyze")}
            className="w-full sm:w-auto bg-[#7C3AED] text-white font-extrabold rounded-2xl transition-all duration-200 shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff] px-8 py-4 flex items-center justify-center gap-2 cursor-pointer hover:bg-[#6d28d9] select-none"
          >
            <span>Roast My Resume</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleSeeExample}
            className="w-full sm:w-auto bg-[#e0e5ec] text-[#2d3748] font-bold rounded-2xl transition-all duration-200 shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#b8bec7,inset_-6px_-6px_12px_#ffffff] px-8 py-4 cursor-pointer hover:text-[#7C3AED] select-none"
          >
            See Example
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: ATS Score */}
        <div className="flex flex-col gap-4 p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02] group">
          <div className="p-3 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] text-[#7C3AED] rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
            <PieChart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#2d3748] text-base mb-1.5">ATS Score</h3>
            <p className="text-[#5a6a85] text-xs font-semibold leading-relaxed">
              Instantly calculate your compatibility score based on parsed resume sections and targeted skills.
            </p>
          </div>
        </div>

        {/* Card 2: Brutal Roast */}
        <div className="flex flex-col gap-4 p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02] group">
          <div className="p-3 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] text-[#7C3AED] rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#2d3748] text-base mb-1.5">Brutal Roast</h3>
            <p className="text-[#5a6a85] text-xs font-semibold leading-relaxed">
              No sugarcoating. AI feedback highlighting weak grammar, clichés, and presentation gaps.
            </p>
          </div>
        </div>

        {/* Card 3: AI Rewrites */}
        <div className="flex flex-col gap-4 p-6 rounded-3xl bg-[#e0e5ec] shadow-[6px_6px_12px_#b8bec7,-6px_-6px_12px_#ffffff] transition-all duration-300 hover:scale-[1.02] group">
          <div className="p-3 bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#b8bec7,inset_-4px_-4px_8px_#ffffff] text-[#7C3AED] rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#2d3748] text-base mb-1.5">AI Rewrites</h3>
            <p className="text-[#5a6a85] text-xs font-semibold leading-relaxed">
              Convert passive tasks into metric-driven achievements using action verbs and structured phrasing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}