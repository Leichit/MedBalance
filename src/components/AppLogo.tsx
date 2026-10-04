import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', showText = true }) => {
  const iconSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  };

  const svgSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
  };

  return (
    <div className="flex items-center gap-2.5">
      {/* App Icon */}
      <div 
        className={`${iconSizes[size]} bg-gradient-to-tr from-blue-700 via-blue-600 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-blue-600/25 ring-1 ring-blue-500/30 shrink-0 relative overflow-hidden`}
      >
        {/* Subtle grid backdrop */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:6px_6px] opacity-40"></div>
        
        {/* Medical Cross + Pulse Curve Icon */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className={`${svgSizes[size]} relative z-10 text-white`}
        >
          {/* Medical Shield Cross Outline */}
          <path d="M12 3v3m0 12v3m-9-9h3m12 0h3" opacity="0.6" strokeWidth="2" />
          {/* Pulse / Radar Wave that sweeps balance */}
          <path d="M4 12h3.5l1.5-3.5 3 7 2-4.5 2 2.5h4" />
        </svg>
      </div>

      {/* Brand Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className="text-base font-extrabold text-slate-900 tracking-tight">
              Med<span className="text-blue-600">Balance</span>
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/80">
              KZ
            </span>
          </div>
          <span className="text-[10px] text-slate-500 font-medium tracking-normal mt-0.5">
            Predictive Drug Radar
          </span>
        </div>
      )}
    </div>
  );
};
