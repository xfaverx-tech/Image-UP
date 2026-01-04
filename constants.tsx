
import React from 'react';
import { StyleOption, EngineOption } from './types';

export const STYLES: StyleOption[] = [
  { id: 'hyperreal', name: 'Hyper Realista', description: 'Realismo fotográfico impactante', previewColor: 'bg-cyan-400' },
  { id: 'anime', name: 'Anime 4K', description: 'Estilo Studio Ghibli vibrante', previewColor: 'bg-pink-400' },
  { id: 'vaporwave', name: 'Vaporwave', description: 'Retro 80s con neones rosas', previewColor: 'bg-purple-500' },
  { id: 'oil', name: 'Óleo Moderno', description: 'Pinceladas con relieve real', previewColor: 'bg-amber-500' },
  { id: 'cyberpunk', name: 'Cyberpunk Red', description: 'Mundo futurista con luz neón', previewColor: 'bg-red-500' },
  { id: 'fantasy', name: 'Fantasía Astral', description: 'Magia, estrellas y auroras', previewColor: 'bg-indigo-500' },
  { id: 'popart', name: 'Pop Art', description: 'Colores saturados estilo cómic', previewColor: 'bg-yellow-400' },
  { id: 'sketch', name: 'Dibujo a Carboncillo', description: 'Elegancia en blanco y negro', previewColor: 'bg-slate-400' }
];

export const ENGINES: EngineOption[] = [
  { id: 'NATIVO', name: 'Nativo', description: 'Ingeniería de Prompts Avanzada', icon: '🧠' },
  { id: 'NANO_BANANA', name: 'Nano Banana', description: 'Optimizado para Gemini Flash', icon: '🍌' },
  { id: 'MIDJOURNEY_GROK', name: 'Midjourney / Grok', description: 'Estética y parámetros artísticos', icon: '🎨' },
  { id: 'DALLE_3', name: 'DALL-E 3', description: 'Narrativo y descriptivo', icon: '🤖' },
  { id: 'STABLE_DIFFUSION', name: 'Stable Diffusion', description: 'Tags y tokens técnicos', icon: '⚙️' },
  { id: 'META_AI', name: 'Meta AI', description: 'Natural y directo', icon: '🔵' }
];

export const Icons = {
  Enhance: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
  ),
  Fusion: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 11 6a7 7 0 0 1 0 14Z"/><path d="M13 18A7 7 0 0 0 13 4a7 7 0 0 0 0 14Z"/></svg>
  ),
  Analyze: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M11 8a3 3 0 0 0-3 3"/></svg>
  ),
  Motion: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 8 6 4-6 4Z"/></svg>
  ),
  Create: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3h.01"/><path d="M19 6h.01"/><path d="M21 12h.01"/><path d="M19 18h.01"/><path d="M12 21h.01"/><path d="M5 18h.01"/><path d="M3 12h.01"/><path d="M5 6h.01"/><circle cx="12" cy="12" r="3"/></svg>
  ),
  Style: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
  ),
  Sticker: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-10.5L15.5 3Z"/><path d="M15 3v5.5a1.5 1.5 0 0 0 1.5 1.5H22"/><path d="M8 13h1"/><path d="M12 13h1"/><path d="M16 13h1"/><path d="M8 17h8"/></svg>
  ),
  Copy: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  )
};
