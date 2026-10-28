import React from 'react';
import { VehicleType, FACTORY_INSIDE_LIMITS, VEHICLE_TYPE_LABELS } from '../types/dispatch';
import { VehicleGraphic } from './VehicleGraphic';
import { AlertTriangle, X, LogOut, CheckCircle2 } from 'lucide-react';

interface CapacityLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedType: VehicleType | null;
  currentInsideCounts: Record<VehicleType, number>;
  onExitFirstVehicle?: (type: VehicleType) => void;
}

export const CapacityLimitModal: React.FC<CapacityLimitModalProps> = ({
  isOpen,
  onClose,
  blockedType,
  currentInsideCounts,
  onExitFirstVehicle,
}) => {
  if (!isOpen || !blockedType) return null;

  const maxAllowed = FACTORY_INSIDE_LIMITS[blockedType];
  const currentCount = currentInsideCounts[blockedType];
  const typeInfo = VEHICLE_TYPE_LABELS[blockedType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        dir="rtl"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-red-500 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
              <AlertTriangle className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-black">
                اكتمال السعة الاستيعابية داخل المصنع!
              </h3>
              <p className="text-xs text-red-100 font-medium">
                تم الوصول للحد الأقصى المسموح به لهذه الفئة
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-red-200 hover:text-white hover:bg-red-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Graphic & Quota Details */}
        <div className="p-6 space-y-4 text-center">
          <div className="w-full h-24 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center p-2">
            <VehicleGraphic type={blockedType} view="side" color="#DC2626" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-black mb-1">
              <span>{typeInfo.nameAr}</span>
              <span>·</span>
              <span>{currentCount} من أصل {maxAllowed} حالياً بالداخل</span>
            </div>
            <h4 className="text-sm font-bold text-slate-800 mt-2">
              لا يمكن إدخال مركبة إضافية من نوع ({typeInfo.nameAr})
            </h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              وفقاً لقواعد الأمن والسلامة في مصنع جوتن، الحد الأقصى المتزامن داخل عنابر التحميل والتعتيق هو:
            </p>
          </div>

          {/* All Inside Factory Limits Overview */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
            <div className={`p-2 rounded-xl border ${blockedType === 'trella' ? 'bg-red-50 border-red-300 ring-2 ring-red-400' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-800">تريلا</div>
              <div className="text-xs font-black font-mono mt-0.5 text-red-700">
                {currentInsideCounts.trella} / {FACTORY_INSIDE_LIMITS.trella}
              </div>
              <div className="text-[10px] text-slate-400">أقصى حد: 3</div>
            </div>

            <div className={`p-2 rounded-xl border ${blockedType === 'jumbo' ? 'bg-red-50 border-red-300 ring-2 ring-red-400' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-800">جامبو</div>
              <div className="text-xs font-black font-mono mt-0.5 text-blue-700">
                {currentInsideCounts.jumbo} / {FACTORY_INSIDE_LIMITS.jumbo}
              </div>
              <div className="text-[10px] text-slate-400">أقصى حد: 5</div>
            </div>

            <div className={`p-2 rounded-xl border ${blockedType === 'dababa' ? 'bg-red-50 border-red-300 ring-2 ring-red-400' : 'bg-white border-slate-200'}`}>
              <div className="font-bold text-slate-800">دبابة</div>
              <div className="text-xs font-black font-mono mt-0.5 text-emerald-700">
                {currentInsideCounts.dababa} / {FACTORY_INSIDE_LIMITS.dababa}
              </div>
              <div className="text-[10px] text-slate-400">أقصى حد: 3</div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500">
            💡 برجاء تسجيل خروج سيارة من نفس النوع أولاً لتفريغ رصيف تحميل داخل المصنع.
          </p>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              حسناً، فهمت
            </button>
            {onExitFirstVehicle && (
              <button
                type="button"
                onClick={() => {
                  onExitFirstVehicle(blockedType);
                  onClose();
                }}
                className="py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                title="تسجيل خروج أقدم سيارة من هذا النوع بالداخل فوراً"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>تفريغ مكان بالخروج</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
