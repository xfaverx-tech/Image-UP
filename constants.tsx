
import React from 'react';
import { StyleOption } from './types';

export const STYLES: StyleOption[] = [
  { id: 'cinematic', name: 'Cinematográfico', previewColor: 'bg-blue-500' },
  { id: 'vintage', name: 'Vintage 90s', previewColor: 'bg-amber-600' },
  { id: 'cyber', name: 'Cyberpunk', previewColor: 'bg-fuchsia-500' },
  { id: 'anime', name: 'Estilo Ghibli', previewColor: 'bg-emerald-400' },
  { id: 'bw', name: 'Blanco y Negro Pro', previewColor: 'bg-slate-400' }
];

export const Icons = {
  Enhance: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  ),
  Edit: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  ),
  Sticker: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M15 9h.01"/><path d="M9 9h.01"/><path d="M8.5 14.5c1.5 1.5 5.5 1.5 7 0"/></svg>
  ),
  Style: () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20.94c1.88-1.55 3.11-3.62 3.11-5.94 0-3.31-2.69-6-6-6-2.32 0-4.39 1.23-5.94 3.11C3.11 14.06 2 16.13 2 18.44c0 3.31 2.69 6 6 6 2.32 0 4.39-1.23 5.94-3.11z"/><path d="M22 18.44c0-3.31-2.69-6-6-6-2.32 0-4.39 1.23-5.94 3.11.94 1.55 1.5 3.31 1.5 5.33 0 1.88-1.55 3.11-3.62 3.11 3.31 0 6-2.69 6-6z"/></svg>
  )
};
