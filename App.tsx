
import React, { useState, useEffect } from 'react';
import { ToolType, AppState, GenerationResult, PromptEngine } from './types';
import { Icons, STYLES, ENGINES } from './constants';
import { GeminiService } from './services/geminiService';

const NavItem: React.FC<{ 
  id: ToolType; 
  label: string; 
  icon: React.ReactNode; 
  active: boolean; 
  onClick: (id: ToolType) => void;
  isMobile?: boolean;
}> = ({ id, label, icon, active, onClick, isMobile }) => {
  if (isMobile) {
    return (
      <button
        onClick={() => onClick(id)}
        className={`flex flex-col items-center justify-center flex-1 py-2 transition-all ${
          active ? 'text-indigo-400' : 'text-slate-500'
        }`}
      >
        <span className={`${active ? 'scale-110' : ''} transition-transform`}>{icon}</span>
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{label.split(' ')[0]}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-300 group ${
        active 
          ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>
        {icon}
      </span>
      <span className="font-semibold text-xs tracking-wide">{label}</span>
    </button>
  );
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    activeTool: ToolType.FUSION,
    isProcessing: false,
    result: null,
    error: null
  });

  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].name);
  const [selectedEngine, setSelectedEngine] = useState<PromptEngine>(ENGINES[0].id);
  const [isMobile, setIsMobile] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleToolChange = (tool: ToolType) => {
    setState(prev => ({ ...prev, activeTool: tool, result: null, error: null }));
    setFiles([]);
    setPrompt('');
    setCopySuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const newFiles = Array.from(e.target.files || []);
    if (state.activeTool === ToolType.FUSION) {
      const updatedFiles = [...files];
      if (typeof index === 'number') {
        updatedFiles[index] = newFiles[0];
      } else {
        updatedFiles.push(...newFiles);
      }
      setFiles(updatedFiles.slice(0, 2));
    } else {
      setFiles(newFiles.slice(0, 1));
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Fallo al copiar: ', err);
    }
  };

  const processAction = async () => {
    if (state.isProcessing) return;
    setState(prev => ({ ...prev, isProcessing: true, error: null, result: null }));
    setCopySuccess(false);
    try {
      let url = '';
      let textResult = '';

      switch (state.activeTool) {
        case ToolType.ENHANCE:
          if (!files[0]) throw new Error("Selecciona una imagen.");
          url = await GeminiService.enhanceImage(files[0]);
          break;
        case ToolType.FUSION:
          if (files.length < 2 || !files[0] || !files[1]) throw new Error("Sube 2 imágenes para el Remix.");
          url = await GeminiService.fuseImages(files[0], files[1], prompt);
          break;
        case ToolType.STICKER:
          if (!prompt) throw new Error("Escribe una idea.");
          url = await GeminiService.createSticker(prompt);
          break;
        case ToolType.PROMPT_GEN:
          if (!files[0]) throw new Error("Sube una imagen.");
          textResult = await GeminiService.analyzeImageForPrompt(files[0], selectedEngine);
          break;
        case ToolType.STYLE:
          if (!files[0]) throw new Error("Sube una imagen.");
          url = await GeminiService.changeStyle(files[0], selectedStyle);
          break;
      }

      setState(prev => ({ 
        ...prev, 
        isProcessing: false, 
        result: { url, prompt: textResult, type: 'image' } 
      }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isProcessing: false, error: err.message || 'Error inesperado' }));
    }
  };

  const canProcess = state.activeTool === ToolType.STICKER 
    ? !!prompt 
    : (state.activeTool === ToolType.FUSION ? files.length === 2 : files.length > 0);

  const navigationItems = [
    { id: ToolType.FUSION, label: "Remix Studio", icon: <Icons.Fusion /> },
    { id: ToolType.ENHANCE, label: "Mejora HD", icon: <Icons.Enhance /> },
    { id: ToolType.STYLE, label: "Estilos", icon: <Icons.Style /> },
    { id: ToolType.STICKER, label: "Stickers", icon: <Icons.Sticker /> },
    { id: ToolType.PROMPT_GEN, label: "Analizar", icon: <Icons.Analyze /> }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen relative z-10 overflow-hidden bg-vivid text-slate-200">
      {/* Sidebar - Desktop Only */}
      {!isMobile && (
        <aside className="w-72 glass flex flex-col p-6 gap-6 border-r border-white/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Icons.Fusion />
            </div>
            <h1 className="text-lg font-black tracking-tighter text-white uppercase">Nano<span className="text-indigo-400">Vivid</span></h1>
          </div>

          <nav className="flex flex-col gap-1.5">
            {navigationItems.map(item => (
              <NavItem 
                key={item.id}
                id={item.id} 
                label={item.label} 
                icon={item.icon} 
                active={state.activeTool === item.id} 
                onClick={handleToolChange} 
              />
            ))}
          </nav>

          <div className="mt-auto p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Motor Gratuito Activo</p>
            <p className="text-[8px] text-slate-600 mt-1">Gemini 2.5 Flash Image</p>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto no-scrollbar pt-safe ${isMobile ? 'pb-24' : 'p-12'}`}>
        <div className={`max-w-6xl mx-auto ${isMobile ? 'p-6' : ''}`}>
          <header className="mb-8 flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tight">
                {state.activeTool === ToolType.FUSION && "Remix & Fusión Pro"}
                {state.activeTool === ToolType.ENHANCE && "Mejora de Imagen HD"}
                {state.activeTool === ToolType.STYLE && "Estilos Artísticos"}
                {state.activeTool === ToolType.STICKER && "Sticker Lab"}
                {state.activeTool === ToolType.PROMPT_GEN && "Analizador Visual"}
              </h2>
              <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-bold">Herramientas optimizadas con Flash Engine</p>
            </div>

            <button 
              onClick={processAction}
              disabled={state.isProcessing || !canProcess}
              className="w-full md:w-auto px-10 py-4 bg-indigo-600 active:scale-95 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl disabled:opacity-20 transition-all"
            >
              {state.isProcessing ? "Generando..." : "Ejecutar Motor"}
            </button>
          </header>

          {state.error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[11px] font-bold uppercase">
              ⚠️ {state.error}
            </div>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-4 space-y-6">
              <div className="glass p-6 rounded-3xl border-white/5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 block">Insumos Visuales</label>
                
                {state.activeTool === ToolType.FUSION ? (
                  <div className="grid grid-cols-1 gap-4">
                    {[0, 1].map(idx => (
                      <div key={idx} className="relative aspect-video">
                        <input type="file" onChange={(e) => handleFileChange(e, idx)} className="hidden" id={`f-up-${idx}`} accept="image/*" />
                        <label htmlFor={`f-up-${idx}`} className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden ${files[idx] ? 'border-indigo-500/50' : 'border-white/10 hover:bg-white/5'}`}>
                          {files[idx] ? (
                            <img src={URL.createObjectURL(files[idx])} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-center">
                              <p className="text-[10px] font-black text-slate-400 uppercase mb-1">{idx === 0 ? "Imagen Estructural" : "Imagen de Estilo"}</p>
                              <p className="text-[8px] text-slate-600 uppercase">Haz clic para subir</p>
                            </div>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : state.activeTool !== ToolType.STICKER && (
                  <div className="w-full aspect-square relative">
                    <input type="file" onChange={handleFileChange} className="hidden" id="f-up-single" accept="image/*" />
                    <label htmlFor="f-up-single" className={`w-full h-full flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-all overflow-hidden ${files[0] ? 'border-transparent' : 'border-white/10 hover:bg-white/5'}`}>
                      {files[0] ? (
                        <img src={URL.createObjectURL(files[0])} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase">Sube tu Imagen</p>
                        </div>
                      )}
                    </label>
                  </div>
                )}
              </div>

              {state.activeTool === ToolType.PROMPT_GEN && (
                <div className="glass p-6 rounded-3xl border-white/5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Motor de Destino</label>
                  <div className="grid grid-cols-1 gap-2">
                    {ENGINES.map(engine => (
                      <button
                        key={engine.id}
                        onClick={() => setSelectedEngine(engine.id)}
                        className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all ${selectedEngine === engine.id ? 'border-indigo-500 bg-indigo-500/10 shadow-lg' : 'border-white/5 hover:bg-white/5'}`}
                      >
                        <span className="text-xl">{engine.icon}</span>
                        <div>
                          <p className="text-[11px] font-bold text-white uppercase">{engine.name}</p>
                          <p className="text-[9px] text-slate-500 leading-none mt-1">{engine.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {(state.activeTool === ToolType.FUSION || state.activeTool === ToolType.STICKER) && (
                <div className="glass p-6 rounded-3xl border-white/5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Dirección Creativa</label>
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={state.activeTool === ToolType.STICKER ? "Un gato astronauta..." : "Ej: Combina el edificio con cristales azules..."}
                    className="w-full h-28 bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-indigo-500 focus:outline-none placeholder:text-slate-700 resize-none shadow-inner"
                  />
                </div>
              )}

              {state.activeTool === ToolType.STYLE && (
                <div className="glass p-6 rounded-3xl border-white/5 max-h-[400px] overflow-y-auto no-scrollbar">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 block">Catálogo de Estilos</label>
                  <div className="space-y-2">
                    {STYLES.map(s => (
                      <button 
                        key={s.id} 
                        onClick={() => setSelectedStyle(s.name)} 
                        className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-4 ${selectedStyle === s.name ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-white/5 hover:bg-white/5'}`}
                      >
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.previewColor}`} />
                        <div>
                          <p className="text-[11px] font-bold text-white uppercase">{s.name}</p>
                          <p className="text-[9px] text-slate-500 mt-0.5">{s.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="xl:col-span-8">
              <div className="glass p-6 rounded-[2.5rem] border-white/5 min-h-[400px] lg:min-h-[650px] flex flex-col relative overflow-hidden shadow-2xl">
                {state.isProcessing && (
                  <div className="absolute inset-0 z-30 bg-slate-950/80 backdrop-blur-xl flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(99,102,241,0.3)]"></div>
                    <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tighter">Procesando Remix</h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em]">Usando Gemini 2.5 Flash Engine...</p>
                  </div>
                )}

                <div className="flex-1 flex flex-col items-center justify-center bg-black/40 rounded-3xl border border-white/5 overflow-hidden shadow-inner">
                  {state.result ? (
                    state.result.url ? (
                      <img src={state.result.url} className="max-w-full max-h-[75vh] object-contain animate-in fade-in zoom-in duration-700" alt="Resultado" />
                    ) : (
                      <div className="p-8 w-full h-full flex flex-col relative">
                        <div className="flex justify-between items-center mb-6">
                           <div className="flex items-center gap-3">
                             <span className="text-2xl">{ENGINES.find(e => e.id === selectedEngine)?.icon}</span>
                             <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.2em]">Prompt para {ENGINES.find(e => e.id === selectedEngine)?.name}</span>
                           </div>
                           <button 
                            onClick={() => copyToClipboard(state.result?.prompt || '')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all shadow-lg ${copySuccess ? 'bg-green-600 text-white scale-105' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                           >
                             <Icons.Copy /> {copySuccess ? '¡Copiado!' : 'Copiar al Portapapeles'}
                           </button>
                        </div>
                        <div className="flex-1 overflow-y-auto no-scrollbar bg-black/50 p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                           <pre className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono italic">{state.result.prompt}</pre>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="text-center opacity-10 py-32 pointer-events-none flex flex-col items-center">
                      <div className="scale-[3] mb-10 text-slate-400"><Icons.Fusion /></div>
                      <p className="font-black tracking-[0.6em] text-white uppercase text-[12px]">Canvas de Generación</p>
                    </div>
                  )}
                </div>

                {state.result?.url && (
                  <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">NanoVivid Flash Edition</span>
                    <a 
                      href={state.result.url} 
                      download={`nano-remix-${Date.now()}`} 
                      className="w-full sm:w-auto px-10 py-3.5 bg-white text-black active:scale-95 rounded-2xl text-[11px] font-black transition-all shadow-xl text-center uppercase tracking-widest"
                    >
                      Descargar Obra
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Nav */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 flex justify-around px-2 pb-safe z-50">
          {navigationItems.map(item => (
            <NavItem 
              key={item.id}
              id={item.id} 
              label={item.label} 
              icon={item.icon} 
              active={state.activeTool === item.id} 
              onClick={handleToolChange}
              isMobile
            />
          ))}
        </nav>
      )}
    </div>
  );
};

export default App;
