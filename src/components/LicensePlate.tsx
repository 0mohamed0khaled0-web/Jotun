import React from 'react';

interface LicensePlateProps {
  plateNumber?: string;
  digits?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LicensePlate: React.FC<LicensePlateProps> = ({
  plateNumber,
  digits,
  size = 'md',
  className = '',
}) => {
  // Extract pure digits from plateNumber or digits prop (filter out letters if any remain)
  const rawValue = (digits || plateNumber || '1234').toString();
  // Keep numbers only (Arabic and Western digits)
  const cleanDigits = rawValue.replace(/[^\d\u0660-\u0669]/g, '') || rawValue.trim() || '1234';

  // Size configurations
  const sizeStyles = {
    sm: {
      container: 'h-6 text-xs px-2 min-w-[65px]',
      header: 'text-[7px] tracking-wider',
      numberText: 'text-xs font-black tracking-widest',
      bandHeight: 'h-1.5',
    },
    md: {
      container: 'h-8 text-sm px-3 min-w-[85px]',
      header: 'text-[8.5px] tracking-widest',
      numberText: 'text-sm font-black tracking-widest',
      bandHeight: 'h-2',
    },
    lg: {
      container: 'h-10 text-base px-4 min-w-[110px]',
      header: 'text-[10px] tracking-widest',
      numberText: 'text-base font-black tracking-widest',
      bandHeight: 'h-2.5',
    },
  }[size];

  return (
    <div
      dir="rtl"
      className={`relative inline-flex flex-col items-center justify-between bg-white text-slate-900 border-2 border-slate-800 rounded shadow-xs font-bold select-none overflow-hidden ${sizeStyles.container} ${className}`}
      title={`لوحة رقم: ${cleanDigits}`}
    >
      {/* Top Banner (EGYPT / مِصْر) - Blue Transport Band */}
      <div className={`w-full ${sizeStyles.bandHeight} bg-[#0055B8] flex items-center justify-center text-white px-1 leading-none shrink-0`}>
        <span className={`${sizeStyles.header} font-bold opacity-95`}>مِصْر · EGYPT</span>
      </div>

      {/* Main License Plate Body - Pure Numbers Only (أرقام فقط بدون حروف) */}
      <div className="flex items-center justify-center w-full h-full px-1 text-slate-950 font-mono">
        <span className={`${sizeStyles.numberText} tabular-nums text-center select-all`}>
          {cleanDigits}
        </span>
      </div>
    </div>
  );
};
