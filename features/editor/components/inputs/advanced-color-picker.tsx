
"use client";

import { GradientPicker } from "./gradient-picker";


interface AdvancedColorPickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export function AdvancedColorPicker({ label, value, onChange }: AdvancedColorPickerProps) {
  return (
    <GradientPicker 
      label={label} 
      value={value} 
      onChange={onChange} 
    />
  );
}