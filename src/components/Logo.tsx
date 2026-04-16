import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textColor?: string;
  iconOnly?: boolean;
}

export default function Logo({ 
  className, 
  size = 40, 
  showText = true, 
  textColor = "#0f172a",
  iconOnly = false
}: LogoProps) {
  const blueColor = "#0066FF"; // Vibrant blue from the image

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div 
        className="relative flex items-center justify-center shrink-0"
        onClick={() => window.location.href = '/'}
        style={{ width: size, height: size, cursor: 'pointer' }}
      >
        {/* The tilted rounded square icon */}
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <rect 
            x="12" 
            y="12" 
            width="76" 
            height="76" 
            rx="18" 
            fill={blueColor}
            style={{ transform: 'skewX(-6deg)', transformOrigin: 'center' }}
          />
          <text 
            x="50%" 
            y="52%" 
            fill="white" 
            fontSize="52" 
            fontWeight="900" 
            fontFamily="Inter, sans-serif"
            textAnchor="middle"
            dominantBaseline="central"
            style={{ transform: 'skewX(-6deg)', transformOrigin: 'center' }}
          >
            T
          </text>
        </svg>
      </div>
      
      {!iconOnly && showText && (
        <div className="flex items-center select-none cursor-pointer" onClick={() => window.location.href = '/'}>
          <span className={cn("text-[28px] font-black tracking-tight leading-none", textColor)}>
            Tran
          </span>
          <span className="text-[28px] font-black tracking-tight leading-none" style={{ color: blueColor }}>
            sify
          </span>
        </div>
      )}
    </div>
  );
}
