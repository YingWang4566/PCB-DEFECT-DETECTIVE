import React, { useState } from 'react';
import { TEST_CASES } from './constants';
import { convertUrlToBase64 } from './utils/imageUtils';
import { analyzeImageWithClaude, OPENROUTER_API_KEY } from './services/openRouterService';
import { 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Cpu, 
  Activity, 
  AlertTriangle, 
  CheckCircle2,
  ScanSearch
} from 'lucide-react';

const App: React.FC = () => {
  // State
  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [showReference, setShowReference] = useState(false);
  const [showDefect, setShowDefect] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Derived state
  const currentCase = TEST_CASES[currentCaseIndex];

  // Handlers
  const handleNext = () => {
    setCurrentCaseIndex((prev) => (prev + 1) % TEST_CASES.length);
    resetState();
  };

  const handlePrevious = () => {
    setCurrentCaseIndex((prev) => (prev - 1 + TEST_CASES.length) % TEST_CASES.length);
    resetState();
  };

  const resetState = () => {
    setShowReference(false);
    setShowDefect(false);
    setAnalysisResult("");
    setErrorMsg(null);
  };

  const toggleReference = () => setShowReference(!showReference);
  const toggleDefect = () => setShowDefect(!showDefect);

  const runAICheck = async () => {
    if (!OPENROUTER_API_KEY) {
      setErrorMsg("缺少 API Key。请在代码 services/openRouterService.ts 中配置。");
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);
    setAnalysisResult("");

    try {
      // 1. Convert current image to Base64
      const base64Str = await convertUrlToBase64(currentCase.imageSrc);
      
      // 2. Call API
      const resultText = await analyzeImageWithClaude(base64Str);
      
      // 3. Update Result
      setAnalysisResult(resultText);
    } catch (err: any) {
      setErrorMsg(err.message || "检测过程中发生未知错误。");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen bg-eda-bg text-eda-text font-mono flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 shrink-0 border-b border-eda-border bg-eda-panel flex items-center px-6 justify-between shadow-md z-20">
        <div className="flex items-center gap-3">
          <Cpu className="w-6 h-6 text-eda-accent" />
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight">PCB 智能缺陷检测系统</h1>
            <p className="text-[10px] text-eda-text opacity-70 leading-tight">基于多模态大模型</p>
          </div>
        </div>
        <div className="text-xs bg-eda-bg px-3 py-1 rounded border border-eda-border">
          案例 ID: <span className="text-eda-accent font-bold">{currentCase.id.toString().padStart(3, '0')}</span>
        </div>
      </header>

      {/* Main Content Area - Flex Column with No Scroll */}
      <main className="flex-1 p-4 flex flex-col gap-3 w-full min-h-0">
        
        {/* Image Visualization Area (Flex 1 to take all available space) */}
        <div className="flex-1 flex gap-4 min-h-0 relative">
          {/* Left: Target Image (Always Visible) */}
          <div className="flex-1 flex flex-col border border-eda-border rounded-lg overflow-hidden bg-black relative group shadow-inner">
            <div className="absolute top-0 left-0 bg-black/70 px-3 py-1 text-xs text-eda-warning font-bold z-10 border-b border-r border-eda-border">
              待测原图 (Target)
            </div>
            <img 
              src={currentCase.imageSrc} 
              alt="Target PCB" 
              className="w-full h-full object-contain p-2"
            />
          </div>

          {/* Right: Stacked Views (Defect & Reference) */}
          {(showReference || showDefect) && (
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              
              {/* Defect Annotation View */}
              {showDefect && (
                <div className={`flex flex-col border border-eda-border rounded-lg overflow-hidden bg-black relative animate-in fade-in duration-300 shadow-inner ${showReference ? 'h-1/2' : 'h-full'}`}>
                  <div className="absolute top-0 left-0 bg-black/70 px-3 py-1 text-xs text-eda-error font-bold z-10 border-b border-r border-eda-border">
                    缺陷标注 (Defect)
                  </div>
                  <img 
                    src={currentCase.defectSrc} 
                    alt="Defect Annotation" 
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              )}

              {/* Reference View */}
              {showReference && (
                <div className={`flex flex-col border border-eda-border rounded-lg overflow-hidden bg-black relative animate-in fade-in duration-300 shadow-inner ${showDefect ? 'h-1/2' : 'h-full'}`}>
                  <div className="absolute top-0 left-0 bg-black/70 px-3 py-1 text-xs text-eda-success font-bold z-10 border-b border-r border-eda-border">
                    标准真值 (Reference)
                  </div>
                  <img 
                    src={currentCase.referenceSrc} 
                    alt="Reference PCB" 
                    className="w-full h-full object-contain p-2"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Case Info Bar */}
        <div className="shrink-0 bg-eda-panel p-2 px-4 rounded border border-eda-border flex justify-between items-center text-sm shadow-sm">
          <div className="truncate pr-4">
            <span className="text-gray-400">描述: </span>
            <span className="text-white">{currentCase.description}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className={`w-2 h-2 rounded-full ${analysisResult ? 'bg-eda-success' : 'bg-gray-500'}`}></div>
            <span className="uppercase text-[10px] font-bold tracking-wider">
              {analysisResult ? '检测完成' : '就绪'}
            </span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="shrink-0 grid grid-cols-12 gap-4">
          {/* Left Side: Previous (Col 3) */}
          <div className="col-span-3 flex justify-start">
            <button
              onClick={handlePrevious}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-eda-panel hover:bg-slate-700 border border-eda-border rounded text-sm transition-colors disabled:opacity-50 text-white shadow-sm w-full justify-center"
            >
              <ChevronLeft className="w-4 h-4" />
              上一张
            </button>
          </div>

          {/* Middle: Toggles (Col 6) */}
          <div className="col-span-6 flex justify-center gap-2">
            <button
              onClick={toggleDefect}
              className={`flex items-center gap-2 px-4 py-2 border border-eda-border rounded text-sm transition-colors text-white shadow-sm flex-1 justify-center
                ${showDefect ? 'bg-eda-error/20 border-eda-error text-eda-error' : 'bg-eda-panel hover:bg-slate-700'}
              `}
            >
              {showDefect ? <EyeOff className="w-4 h-4" /> : <ScanSearch className="w-4 h-4" />}
              {showDefect ? "隐藏缺陷" : "显示缺陷"}
            </button>
            <button
              onClick={toggleReference}
              className={`flex items-center gap-2 px-4 py-2 border border-eda-border rounded text-sm transition-colors text-white shadow-sm flex-1 justify-center
                ${showReference ? 'bg-eda-success/20 border-eda-success text-eda-success' : 'bg-eda-panel hover:bg-slate-700'}
              `}
            >
              {showReference ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showReference ? "隐藏真值" : "显示真值"}
            </button>
          </div>

          {/* Right Side: Next (Col 3) */}
          <div className="col-span-3 flex justify-end">
            <button
              onClick={handleNext}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-4 py-2 bg-eda-panel hover:bg-slate-700 border border-eda-border rounded text-sm transition-colors disabled:opacity-50 text-white shadow-sm w-full justify-center"
            >
              下一张
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Area: Primary Action & Result */}
        <div className="shrink-0 flex flex-col gap-2">
          <button
            onClick={runAICheck}
            disabled={isAnalyzing}
            className={`
              w-full py-3 rounded font-bold text-sm tracking-widest uppercase shadow-md transition-all
              flex items-center justify-center gap-2
              ${isAnalyzing 
                ? 'bg-eda-border cursor-wait text-gray-400' 
                : 'bg-eda-accent hover:bg-blue-500 text-white hover:shadow-blue-500/20'}
            `}
          >
            {isAnalyzing ? (
              <>
                <Activity className="w-4 h-4 animate-pulse" />
                正在智能分析...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                开始 AI 检测
              </>
            )}
          </button>

          {/* Result Area - Increased Height */}
          <div className="relative">
            {errorMsg && (
              <div className="absolute top-2 left-2 right-2 bg-eda-error/20 text-eda-error p-2 rounded border border-eda-error flex items-center gap-2 text-xs z-20 backdrop-blur-sm">
                <AlertTriangle className="w-4 h-4" />
                {errorMsg}
              </div>
            )}

            <textarea
              readOnly
              value={analysisResult}
              placeholder="等待 AI 返回检测报告..."
              className={`
                w-full h-40 bg-black/50 border rounded p-4 font-mono text-base leading-relaxed resize-none focus:outline-none focus:border-eda-accent transition-colors
                ${analysisResult ? 'border-eda-success text-green-400' : 'border-eda-border text-gray-500'}
              `}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;