
import React, { useState } from 'react';
import { ToolType, AppState, GenerationResult } from './types';
import { Icons, STYLES } from './constants';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    activeTool: ToolType.ENHANCE,
    isProcessing: false,
    result: null,
    error: null
  });

  const [files, setFiles] = useState<File[]>([]);
  const [instruction, setInstruction] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].name);

  const handleToolChange = (tool: ToolType) => {
    setState(prev => ({ ...prev, activeTool: tool, result: null, error: null }));
    setInstruction('');
  };

  const processAction = async () => {
    if (state.isProcessing) return;
    if (state.activeTool !== ToolType.STICKER && !files[0]) {
      setState(prev => ({ ...prev, error: "Por favor, selecciona una imagen primero." }));
      return;
    }
    if ((state.activeTool === ToolType.EDIT || state.activeTool === ToolType.STICKER) && !instruction) {
      setState(prev => ({ ...prev, error: "Escribe qué quieres hacer." }));
      return;
    }

    setState(prev => ({ ...prev, isProcessing: true, error: null, result: null }));
    try {
      let res: string;
      let type: 'image' | 'video' = 'image';

      switch (state.activeTool) {
        case ToolType.ENHANCE:
          res = await GeminiService.enhanceImage(files[0]);
          break;
        case ToolType.EDIT:
          res = await GeminiService.editImage(files[0], instruction);
          break;
        case ToolType.STYLE:
          res = await GeminiService.applyStyle(files[0], selectedStyle);
          break;
        case ToolType.STICKER:
          res = await GeminiService.createSticker(instruction);
          type = 'video';
          break;
        default:
          throw new Error("Herramienta no implementada.");
      }

      setState(prev => ({ ...prev, isProcessing: false, result: { url: res, type } }));
    } catch (err: any) {
      setState(prev => ({ ...prev, isProcessing: false, error: err.message || "Ocurrió un error inesperado." }));
    }
  };

  const navItems = [
    { id: ToolType.ENHANCE, label: "Mejorar", icon: <Icons.Enhance /> },
    { id: ToolType.EDIT, label: "Editar", icon: <Icons.Edit /> },
    { id: ToolType.STYLE, label: "Estilos", icon: <Icons.Style /> },
    { id: ToolType.STICKER, label: "Stickers", icon: <Icons.Sticker /> }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30">
      {/* Top Navbar */}
      <nav className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Icons.Enhance />
          </div>
          <h1 className="font-bold tracking-tight text-lg">NanoStudio<span className="text-indigo-400">AI</span></h1>
        </div>
        <button 
          onClick={processAction}
          disabled={state.isProcessing}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
        >
          {state.isProcessing ? "Procesando..." : "Generar"}
        </button>
      </nav>

      <div className="max-w-6xl mx-auto p-4 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex bg-black/40 p-1 rounded-xl">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleToolChange(item.id)}
                  className={`flex-1 flex flex-col items-center py-3 rounded-lg transition-all ${state.activeTool === item.id ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {item.icon}
                  <span className="text-[10px] mt-1 font-bold uppercase">{item.label}</span>
                </button>
              ))}
            </div>

            {state.activeTool !== ToolType.STICKER && (
              <div 
                onClick={() => document.getElementById('image-upload')?.click()}
                className="aspect-square bg-black/40 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500/50 transition-colors overflow-hidden group"
              >
                <input type="file" id="image-upload" className="hidden" onChange={(e) => setFiles(Array.from(e.target.files || []))} accept="image/*" />
                {files[0] ? (
                  <img src={URL.createObjectURL(files[0])} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <div className="text-center p-4">
                    <p className="text-indigo-400 text-sm font-bold">Seleccionar Foto</p>
                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Click para subir</p>
                  </div>
                )}
              </div>
            )}

            {(state.activeTool === ToolType.EDIT || state.activeTool === ToolType.STICKER) && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">¿Qué quieres crear?</label>
                <textarea 
                  value={instruction}
                  onChange={(e) => setInstruction(e.target.value)}
                  placeholder={state.activeTool === ToolType.STICKER ? "Ej: Un astronauta bailando..." : "Ej: Ponle un sombrero rojo..."}
                  className="w-full h-24 bg-black/40 border border-white/10 rounded-xl p-4 text-sm focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>
            )}

            {state.activeTool === ToolType.STYLE && (
              <div className="grid grid-cols-2 gap-2">
                {STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.name)}
                    className={`p-3 rounded-xl border text-left flex items-center gap-2 transition-all ${selectedStyle === style.name ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:bg-white/5'}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${style.previewColor}`} />
                    <span className="text-[10px] font-bold uppercase">{style.name}</span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {state.error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium">
              ⚠️ {state.error}
            </div>
          )}
        </div>

        {/* Results Area */}
        <div className="lg:col-span-8">
          <div className="bg-white/5 border border-white/10 rounded-3xl min-h-[500px] flex flex-col items-center justify-center relative overflow-hidden">
            {state.isProcessing && (
              <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-lg font-bold">Generando Magia...</p>
                <p className="text-sm text-slate-400 mt-2">Estamos procesando tu imagen con los modelos más avanzados de Google.</p>
              </div>
            )}

            {state.result ? (
              <div className="w-full h-full flex flex-col items-center p-4">
                {state.result.type === 'video' ? (
                  <video src={state.result.url} autoPlay loop muted className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl" />
                ) : (
                  <img src={state.result.url} className="max-w-full max-h-[70vh] rounded-2xl shadow-2xl" alt="Result" />
                )}
                <div className="mt-6 flex gap-4">
                  <a 
                    href={state.result.url} 
                    download="nanostudio-result"
                    className="px-8 py-3 bg-white text-black rounded-full text-sm font-bold hover:scale-105 transition-all"
                  >
                    Descargar Resultado
                  </a>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, result: null }))}
                    className="px-8 py-3 bg-white/5 rounded-full text-sm font-bold hover:bg-white/10 transition-all border border-white/10"
                  >
                    Nuevo Proyecto
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center opacity-20 p-12">
                <div className="scale-[3] mb-8 flex justify-center"><Icons.Enhance /></div>
                <p className="text-sm font-bold uppercase tracking-[0.3em]">Tu resultado aparecerá aquí</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="py-12 text-center text-slate-600 text-[10px] font-bold uppercase tracking-widest">
        Powered by Nano Banana & Gemini 3 Pro
      </footer>
    </div>
  );
};

export default App;
