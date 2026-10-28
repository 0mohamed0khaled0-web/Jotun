import React, { useState } from 'react';
import { Vehicle, VehicleSection, VehicleType, FACTORY_INSIDE_LIMITS } from '../types/dispatch';
import { VehicleCard } from './VehicleCard';
import { TrellaIcon, JumboIcon, DababaIcon } from './VehicleGraphic';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  MousePointerClick, 
  ShieldCheck, 
  AlertCircle,
  Truck,
  PlusCircle,
  Building2,
  AlertTriangle
} from 'lucide-react';

interface DispatchZonesProps {
  requestedVehicles: Vehicle[];
  insideVehicles: Vehicle[];
  onMoveToSection: (vehicleId: string, targetSection: VehicleSection) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenAddModal: (defaultSection: VehicleSection) => void;
  activeDragId: string | null;
}

export const DispatchZones: React.FC<DispatchZonesProps> = ({
  requestedVehicles,
  insideVehicles,
  onMoveToSection,
  onSelectVehicle,
  onOpenAddModal,
  activeDragId,
}) => {
  const [dragOverRequested, setDragOverRequested] = useState(false);
  const [dragOverInside, setDragOverInside] = useState(false);

  // Count inside vehicles by type
  const insideTrellaCount = insideVehicles.filter((v) => v.vehicleType === 'trella').length;
  const insideJumboCount = insideVehicles.filter((v) => v.vehicleType === 'jumbo').length;
  const insideDababaCount = insideVehicles.filter((v) => v.vehicleType === 'dababa').length;
  const totalInsideCount = insideVehicles.length;
  const maxTotalInside = FACTORY_INSIDE_LIMITS.trella + FACTORY_INSIDE_LIMITS.jumbo + FACTORY_INSIDE_LIMITS.dababa; // 3 + 5 + 3 = 11

  const handleDragOver = (e: React.DragEvent, section: 'requested' | 'inside') => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (section === 'requested') setDragOverRequested(true);
    if (section === 'inside') setDragOverInside(true);
  };

  const handleDragLeave = (section: 'requested' | 'inside') => {
    if (section === 'requested') setDragOverRequested(false);
    if (section === 'inside') setDragOverInside(false);
  };

  const handleDrop = (e: React.DragEvent, targetSection: VehicleSection) => {
    e.preventDefault();
    setDragOverRequested(false);
    setDragOverInside(false);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      let vehicleId = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        if (parsed.vehicleId) vehicleId = parsed.vehicleId;
      }
      if (vehicleId) {
        onMoveToSection(vehicleId, targetSection);
      }
    } catch {
      const vehicleId = e.dataTransfer.getData('text/plain');
      if (vehicleId) {
        onMoveToSection(vehicleId, targetSection);
      }
    }
  };

  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* 1. مطلوب (اضغط أو اسحب) - Red Border Zone */}
      <div
        onDragOver={(e) => handleDragOver(e, 'requested')}
        onDragLeave={() => handleDragLeave('requested')}
        onDrop={(e) => handleDrop(e, 'requested')}
        className={`lg:col-span-5 relative flex flex-col justify-between rounded-3xl border-3 p-5 transition-all duration-200 bg-white shadow-sm ${
          dragOverRequested
            ? 'border-red-600 bg-red-50/80 ring-4 ring-red-500/20 scale-[1.01]'
            : 'border-red-500/80 hover:border-red-600'
        }`}
      >
        {/* Header with Red Hand-Click Tag */}
        <div className="flex items-center justify-between pb-3 border-b border-red-100 mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xs">
              <MousePointerClick className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h3 className="text-base font-black text-red-700 flex items-center gap-1.5">
                <span>مطلوب (اضغط أو اسحب)</span>
                <span className="text-xs font-bold bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-mono">
                  {requestedVehicles.length}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                الشاحنات المستدعاة للتجهيز وبانتظار أمر الدخول للعنابر
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddModal('requested')}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
            title="طلب سيارة جديدة مباشرة"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>طلب سيارة</span>
          </button>
        </div>

        {/* Content list of requested vehicles */}
        <div className="flex-1 flex flex-col gap-3 min-h-[190px] justify-center">
          {requestedVehicles.length > 0 ? (
            requestedVehicles.map((veh) => (
              <VehicleCard
                key={veh.id}
                vehicle={veh}
                displayMode="side-card"
                onMoveToSection={onMoveToSection}
                onSelectVehicle={onSelectVehicle}
                isDragging={activeDragId === veh.id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 border-2 border-dashed border-red-200 rounded-2xl bg-red-50/30">
              <div className="w-12 h-12 rounded-2xl bg-red-100/70 flex items-center justify-center text-red-500 mb-2">
                <Truck className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                لا توجد عربيات في قائمة المطلوب حالياً
              </p>
              <p className="text-[11px] text-slate-400 max-w-[240px] mt-1 leading-relaxed">
                اضغط «استدعاء» على أي شاحنة خارج المصنع، أو اسحبها هنا
              </p>
            </div>
          )}
        </div>

        {/* Bottom Hint */}
        <div className="mt-4 pt-2.5 border-t border-red-100 flex items-center justify-between text-[11px] text-red-700">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-red-500" />
            جاهزة للتوجيه إلى داخل المصنع
          </span>
          <span className="font-bold text-xs">الخطوة التالية ⬅️</span>
        </div>
      </div>

      {/* Middle Interactive Connector & Arrow */}
      <div className="lg:col-span-2 hidden lg:flex flex-col items-center justify-center relative py-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="text-[11px] font-bold text-slate-600 text-center bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-xs">
            بوابة الدخول 🏭
          </div>

          <svg width="80" height="60" viewBox="0 0 80 60" fill="none" className="text-red-500">
            <path
              d="M10 30 L65 30"
              stroke="#EF4444"
              strokeWidth="3.5"
              strokeDasharray="6 4"
            />
            <polygon points="70,30 58,24 58,36" fill="#EF4444" />
          </svg>

          {/* Quick Step Button */}
          {requestedVehicles.length > 0 && (
            <button
              type="button"
              onClick={() => {
                onMoveToSection(requestedVehicles[0].id, 'inside');
              }}
              className="group flex flex-col items-center justify-center p-2.5 rounded-2xl bg-linear-to-r from-red-600 to-emerald-600 text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="إدخال أول عربية مطلوبة إلى المصنع بنقرة واحدة"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-[10px] font-bold mt-1 whitespace-nowrap">إدخال للمصنع</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. داخل المصنع (جاري التحميل والتعتيق) - Green Border Zone with Strict Quota Meters */}
      <div
        onDragOver={(e) => handleDragOver(e, 'inside')}
        onDragLeave={() => handleDragLeave('inside')}
        onDrop={(e) => handleDrop(e, 'inside')}
        className={`lg:col-span-5 relative flex flex-col justify-between rounded-3xl border-3 p-5 transition-all duration-200 bg-white shadow-sm ${
          dragOverInside
            ? 'border-emerald-600 bg-emerald-50/80 ring-4 ring-emerald-500/20 scale-[1.01]'
            : 'border-emerald-500/80 hover:border-emerald-600'
        }`}
      >
        {/* Header with Green Checkmark Icon */}
        <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-emerald-800 flex items-center gap-1.5">
                <span>داخل المصنع (جاري التحميل)</span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                  {totalInsideCount} / {maxTotalInside}
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                الشاحنات في العنابر قيد تحميل دهانات وبويات جوتن
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenAddModal('inside')}
            className="text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors cursor-pointer font-bold"
            title="تسجيل دخول مباشر للمصنع"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>إدخال مباشر</span>
          </button>
        </div>

        {/* Live Inside Capacity Dashboard Cards (3 تريلا، 5 جامبو، 3 دبابة) */}
        <div className="mb-3 p-2.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>السعة الاستيعابية المحددة للعنابر:</span>
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              إجمالي: {totalInsideCount}/{maxTotalInside}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {/* Trella quota: max 3 */}
            <div className={`p-2 rounded-xl border transition-all ${
              insideTrellaCount >= FACTORY_INSIDE_LIMITS.trella
                ? 'bg-red-50 border-red-300 text-red-900 ring-1 ring-red-400'
                : 'bg-white border-emerald-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <span>تريلا</span>
                </span>
                <span className="font-mono text-xs font-black">
                  {insideTrellaCount}/{FACTORY_INSIDE_LIMITS.trella}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    insideTrellaCount >= 3 ? 'bg-red-600' : insideTrellaCount === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(insideTrellaCount / FACTORY_INSIDE_LIMITS.trella) * 100}%` }}
                />
              </div>
              <div className="text-[9px] text-slate-400 mt-1 text-center font-medium">
                {insideTrellaCount >= 3 ? '⚠️ مكتمل (3)' : `متبقي ${3 - insideTrellaCount}`}
              </div>
            </div>

            {/* Jumbo quota: max 5 */}
            <div className={`p-2 rounded-xl border transition-all ${
              insideJumboCount >= FACTORY_INSIDE_LIMITS.jumbo
                ? 'bg-red-50 border-red-300 text-red-900 ring-1 ring-red-400'
                : 'bg-white border-emerald-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <span>جامبو</span>
                </span>
                <span className="font-mono text-xs font-black">
                  {insideJumboCount}/{FACTORY_INSIDE_LIMITS.jumbo}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    insideJumboCount >= 5 ? 'bg-red-600' : insideJumboCount >= 3 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(insideJumboCount / FACTORY_INSIDE_LIMITS.jumbo) * 100}%` }}
                />
              </div>
              <div className="text-[9px] text-slate-400 mt-1 text-center font-medium">
                {insideJumboCount >= 5 ? '⚠️ مكتمل (5)' : `متبقي ${5 - insideJumboCount}`}
              </div>
            </div>

            {/* Dababa quota: max 3 */}
            <div className={`p-2 rounded-xl border transition-all ${
              insideDababaCount >= FACTORY_INSIDE_LIMITS.dababa
                ? 'bg-red-50 border-red-300 text-red-900 ring-1 ring-red-400'
                : 'bg-white border-emerald-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="flex items-center gap-1">
                  <span>دبابة</span>
                </span>
                <span className="font-mono text-xs font-black">
                  {insideDababaCount}/{FACTORY_INSIDE_LIMITS.dababa}
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    insideDababaCount >= 3 ? 'bg-red-600' : insideDababaCount === 2 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${(insideDababaCount / FACTORY_INSIDE_LIMITS.dababa) * 100}%` }}
                />
              </div>
              <div className="text-[9px] text-slate-400 mt-1 text-center font-medium">
                {insideDababaCount >= 3 ? '⚠️ مكتمل (3)' : `متبقي ${3 - insideDababaCount}`}
              </div>
            </div>
          </div>
        </div>

        {/* Content list of vehicles inside factory */}
        <div className="flex-1 flex flex-col gap-3 min-h-[190px] justify-center">
          {insideVehicles.length > 0 ? (
            insideVehicles.map((veh) => (
              <VehicleCard
                key={veh.id}
                vehicle={veh}
                displayMode="side-card"
                onMoveToSection={onMoveToSection}
                onSelectVehicle={onSelectVehicle}
                isDragging={activeDragId === veh.id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 border-2 border-dashed border-emerald-200 rounded-2xl bg-emerald-50/30">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 flex items-center justify-center text-emerald-600 mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700">
                لا توجد شاحنات قيد التحميل داخل المصنع الآن
              </p>
              <p className="text-[11px] text-slate-400 max-w-[240px] mt-1 leading-relaxed">
                اسحب شاحنة من قائمة «مطلوب» أو اضغط على «إدخال للمصنع» لبدء التحميل
              </p>
            </div>
          )}
        </div>

        {/* Bottom Status */}
        <div className="mt-4 pt-2.5 border-t border-emerald-100 flex items-center justify-between text-[11px] text-emerald-800">
          <span className="flex items-center gap-1 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            الحد الأقصى الإجمالي: 11 مركبة (3 تريلا + 5 جامبو + 3 دبابة)
          </span>
          <span className="text-slate-500 font-semibold">
            عند الانتهاء اضغط «تسجيل خروج»
          </span>
        </div>
      </div>
    </div>
  );
};
