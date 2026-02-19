"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const VideoForm = ({ content, onUpdate }: any) => (
  <div className="space-y-1 animate-in fade-in">
    <Label className="text-[10px] font-bold text-slate-500 uppercase">Link do YouTube</Label>
    <Input value={content.url || ""} onChange={(e) => onUpdate({ url: e.target.value })} placeholder="https://www.youtube.com/watch?v=..." />
    <p className="text-[9px] text-slate-400 italic">O editor processará o código embed automaticamente.</p>
  </div>
);