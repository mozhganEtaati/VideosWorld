"use client";

import { Slider } from "./slider";
import { toPersianDigits } from "@/lib/jalali";

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

/** Dual-thumb year range built on the shadcn Slider. */
export function RangeSlider({ min, max, value, onChange }: RangeSliderProps) {
  return (
    <div dir="ltr" className="w-full">
      <Slider
        min={min}
        max={max}
        step={1}
        value={value}
        onValueChange={(v) => onChange([v[0] ?? min, v[1] ?? max])}
        className="py-2"
      />
      <div className="mt-1 flex justify-between text-xs text-muted">
        <span>{toPersianDigits(value[0])}</span>
        <span>{toPersianDigits(value[1])}</span>
      </div>
    </div>
  );
}
