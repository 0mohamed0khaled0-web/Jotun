import React from 'react';
import { MousePointerClick, ArrowDown, ChevronLeft } from 'lucide-react';

interface VisualGuideOverlayProps {
  isVisible: boolean;
  onToggle: () => void;
}

export const VisualGuideOverlay: React.FC<VisualGuideOverlayProps> = ({
  isVisible,
  onToggle,
}) => {
  if (!isVisible) {
    return (
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={onToggle}
          className="text-[11px] font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>إظهار مسارات الأسهم التوجيهية (مثل الشاشة)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative mb-3 p-3 bg-red-50/60 border border-red-200/80 rounded-xl flex items-center justify-between text-xs text-red-900">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-black shrink-0 shadow-xs">
          ١
        </div>
        <div>
          <span className="font-bold block">
            دليل الحركة المرئي (اسحب أو اضغط):
          </span>
          <span className="text-[11px] text-red-700">
            خارج المصنع (الرصيف) ➔ اسحب لـ «مطلوب» ➔ اسحب لـ «داخل المصنع» ➔ تسجيل خروج
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-block text-[11px] bg-white border border-red-200 text-red-700 px-2 py-0.5 rounded font-mono">
          سحب وإفلات Drag & Drop مفعّل
        </span>
        <button
          type="button"
          onClick={onToggle}
          className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
        >
          إخفاء الدليل
        </button>
      </div>
    </div>
  );
};
