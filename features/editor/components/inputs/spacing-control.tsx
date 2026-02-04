"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Link2, Unlink2 } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface SpacingControlProps {
  label: string;
  values: { top: number; right: number; bottom: number; left: number };
  onChange: (newValues: { top?: number; right?: number; bottom?: number; left?: number }) => void;
}

export function SpacingControl({ label, values, onChange }: SpacingControlProps) {
 
  const [isLinked, setIsLinked] = useState(false);


  const handleChange = (side: keyof typeof values | "all", valStr: string) => {
    const val = parseInt(valStr) || 0;

    if (side === "all" || isLinked) {
  
      onChange({ top: val, right: val, bottom: val, left: val });
    } else {

      onChange({ [side]: val });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
         <Label className="text-xs font-bold text-slate-700">{label}</Label>
         
         <TooltipProvider>
           <Tooltip>
             <TooltipTrigger asChild>
               <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn("h-6 w-6 rounded-full", isLinked ? "bg-blue-100 text-blue-600" : "text-slate-400")}
                  onClick={() => setIsLinked(!isLinked)}
               >
                 {isLinked ? <Link2 className="w-3.5 h-3.5" /> : <Unlink2 className="w-3.5 h-3.5" />}
               </Button>
             </TooltipTrigger>
             <TooltipContent>
               <p className="text-xs">{isLinked ? "Desvincular valores" : "Vincular todos os lados"}</p>
             </TooltipContent>
           </Tooltip>
         </TooltipProvider>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* Usamos um grid visual para representar Top/Right/Bottom/Left */}
        
        {/* Top */}
        <div className="flex items-center gap-2">
           <span className="text-[10px] w-4 text-slate-400 font-bold">T</span>
           <Input 
             type="number" 
             className="h-8 text-xs" 
             value={values.top}
             onChange={(e) => handleChange("top", e.target.value)}
           />
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
           <span className="text-[10px] w-4 text-slate-400 font-bold">R</span>
           <Input 
             type="number" 
             className="h-8 text-xs" 
             value={values.right}
             onChange={(e) => handleChange("right", e.target.value)}
           />
        </div>

        {/* Bottom */}
        <div className="flex items-center gap-2">
           <span className="text-[10px] w-4 text-slate-400 font-bold">B</span>
           <Input 
             type="number" 
             className="h-8 text-xs" 
             value={values.bottom}
             onChange={(e) => handleChange("bottom", e.target.value)}
           />
        </div>

        {/* Left */}
        <div className="flex items-center gap-2">
           <span className="text-[10px] w-4 text-slate-400 font-bold">L</span>
           <Input 
             type="number" 
             className="h-8 text-xs" 
             value={values.left}
             onChange={(e) => handleChange("left", e.target.value)}
           />
        </div>
      </div>
    </div>
  );
}