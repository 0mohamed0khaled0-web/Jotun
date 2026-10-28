import React, { useState, useMemo } from 'react';
import { Vehicle, VehicleSection, YARD_MAX_CAPACITY } from '../types/dispatch';
import { VehicleCard } from './VehicleCard';
import { Plus, Warehouse, Filter, ChevronLeft, ChevronRight, Search, CheckCircle2 } from 'lucide-react';

interface YardBayGridProps {
  vehicles: Vehicle[];
  onMoveToSection: (vehicleId: string, targetSection: VehicleSection, bayNumber?: number) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onAddNewToBay: (bayNumber: number) => void;
  activeDragId: string | null;
}

export const YardBayGrid: React.FC<YardBayGridProps> = ({
  vehicles,
  onMoveToSection,
  onSelectVehicle,
  onAddNewToBay,
  activeDragId,
}) => {
  const [dragOverBay, setDragOverBay] = useState<number | null>(null);
  const [isSectionDragOver, setIsSectionDragOver] = useState(false);
  const [filterMode, setFilterMode] = useState<'all' | 'occupied'>('all');
  const [activePage, setActivePage] = useState(1); // Page 1 = bays 1-12, Page 2 = 13-24, etc.
  const [jumpBayInput, setJumpBayInput] = useState('');

  const BAYS_PER_PAGE = 10;
  const totalBays = YARD_MAX_CAPACITY; // 99 bays
  const totalPages = Math.ceil(totalBays / BAYS_PER_PAGE); // 10 pages

  // Calculate visible bays based on filter and pagination
  const visibleBaySlots = useMemo(() => {
    if (filterMode === 'occupied') {
      // Show only bays that currently have vehicles
      const occupiedBays = vehicles
        .map((v) => v.bayNumber)
        .filter((b): b is number => typeof b === 'number')
        .sort((a, b) => a - b);
      return occupiedBays.length > 0 ? occupiedBays : [1, 2, 3, 4, 5, 6, 7, 8];
    }

    // Paginated mode: e.g. Page 1: 1..10, Page 2: 11..20, Page 10: 91..99
    const start = (activePage - 1) * BAYS_PER_PAGE + 1;
    const end = Math.min(start + BAYS_PER_PAGE - 1, totalBays);
    const slots: number[] = [];
    for (let i = start; i <= end; i++) {
      slots.push(i);
    }
    return slots;
  }, [filterMode, activePage, vehicles, totalBays]);

  const handleDragOver = (e: React.DragEvent, bayNum?: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (bayNum !== undefined) {
      setDragOverBay(bayNum);
    }
  };

  const handleDragLeave = (bayNum?: number) => {
    if (bayNum !== undefined && dragOverBay === bayNum) {
      setDragOverBay(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetBay?: number) => {
    e.preventDefault();
    setDragOverBay(null);
    setIsSectionDragOver(false);

    try {
      const dataStr = e.dataTransfer.getData('application/json');
      let vehicleId = e.dataTransfer.getData('text/plain');
      if (dataStr) {
        const parsed = JSON.parse(dataStr);
        if (parsed.vehicleId) vehicleId = parsed.vehicleId;
      }

      if (vehicleId) {
        onMoveToSection(vehicleId, 'yard', targetBay);
      }
    } catch {
      const vehicleId = e.dataTransfer.getData('text/plain');
      if (vehicleId) {
        onMoveToSection(vehicleId, 'yard', targetBay);
      }
    }
  };

  const handleJumpToBay = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(jumpBayInput.trim(), 10);
    if (!isNaN(target) && target >= 1 && target <= totalBays) {
      const targetPage = Math.ceil(target / BAYS_PER_PAGE);
      setActivePage(targetPage);
      setFilterMode('all');
      setJumpBayInput('');
    }
  };

  const occupiedCount = vehicles.length;
  const capacityPercent = Math.min(100, Math.round((occupiedCount / totalBays) * 100));

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsSectionDragOver(true);
      }}
      onDragLeave={() => setIsSectionDragOver(false)}
      onDrop={(e) => handleDrop(e)}
      className={`relative rounded-3xl border-2 transition-all duration-200 overflow-hidden bg-[#0A192F] text-white shadow-xl ${
        isSectionDragOver ? 'border-[#FFA300] ring-4 ring-[#FFA300]/25' : 'border-[#002D72]'
      }`}
    >
      {/* Top Header: Jotun Factory Yard Information */}
      <div className="relative flex items-center justify-between px-6 py-3.5 bg-[#002D72] border-b border-blue-900/80 backdrop-blur-xs z-10 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FFA300] shadow-sm">
            <Warehouse className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base md:text-lg font-black text-white tracking-wide">
                خارج المصنع (ساحة انتظار الشاحنات وأرصفة الساحة)
              </h2>
              <span className="text-[10px] font-bold bg-[#FFA300] text-slate-950 px-2 py-0.5 rounded-full">
                جوتن Jotun
              </span>
            </div>
            <p className="text-xs text-blue-200/90">
              سعة الساحة القصوى 99 شاحنة · اسحب أي سيارة أو اضغط عليها لاستدعائها إلى قائمة «مطلوب»
            </p>
          </div>
        </div>

        {/* 99 Max Capacity Counter with Visual Meter */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-slate-900/80 border border-blue-400/30 px-3.5 py-1.5 rounded-2xl flex items-center gap-3 text-xs">
            <div>
              <div className="flex items-center gap-1.5 font-bold">
                <span className="text-[#FFA300] text-sm font-black font-mono">{occupiedCount}</span>
                <span className="text-slate-400">/</span>
                <span className="text-white text-sm font-black font-mono">{totalBays}</span>
                <span className="text-[11px] text-slate-300">سيارة بالانتظار</span>
              </div>
              {/* Capacity Bar */}
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    capacityPercent > 85 ? 'bg-red-500' : capacityPercent > 60 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${capacityPercent}%` }}
                />
              </div>
            </div>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
              {capacityPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar: Jump to bay (1-99) & Pages / Filter */}
      <div className="px-6 py-2 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3 text-xs">
        {/* Filter Toggle */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              filterMode === 'all'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            عرض الأرصفة (1 - 99)
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('occupied')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1 ${
              filterMode === 'occupied'
                ? 'bg-[#002D72] text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>الأرصفة المشغولة</span>
            <span className="text-[10px] bg-[#FFA300] text-slate-950 font-bold px-1.5 rounded-full">
              {occupiedCount}
            </span>
          </button>
        </div>

        {/* Quick Bay Jump form (1 to 99) */}
        <form onSubmit={handleJumpToBay} className="flex items-center gap-1.5">
          <span className="text-slate-400 text-[11px] hidden sm:inline">انتقال سريع لرصيف:</span>
          <input
            type="number"
            min={1}
            max={99}
            placeholder="رقم 1 - 99"
            value={jumpBayInput}
            onChange={(e) => setJumpBayInput(e.target.value)}
            className="w-24 px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded-lg text-white font-mono text-center focus:outline-hidden focus:border-[#FFA300]"
          />
          <button
            type="submit"
            className="px-2.5 py-1 text-xs bg-[#002D72] hover:bg-blue-800 text-white font-bold rounded-lg cursor-pointer"
          >
            انتقل
          </button>
        </form>

        {/* Pagination when in 'all' mode */}
        {filterMode === 'all' && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={activePage === 1}
              onClick={() => setActivePage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="الصفحة السابقة"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-300 px-1 font-mono">
              الأرصفة {(activePage - 1) * BAYS_PER_PAGE + 1} - {Math.min(activePage * BAYS_PER_PAGE, totalBays)}
            </span>
            <button
              type="button"
              disabled={activePage === totalPages}
              onClick={() => setActivePage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              title="الصفحة التالية"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Industrial Warehouse Architectural Canopy & Roll-up Doors Bays */}
      <div className="relative w-full bg-linear-to-b from-slate-900 via-slate-900/90 to-[#0A192F] pt-4 pb-2 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Bays horizontal scroll container */}
        <div className="overflow-x-auto pb-4 px-4 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="flex items-stretch justify-start min-w-[940px] gap-3">
            {visibleBaySlots.map((bayNum) => {
              const vehicle = vehicles.find((v) => v.bayNumber === bayNum);
              const isOver = dragOverBay === bayNum;

              return (
                <div
                  key={bayNum}
                  onDragOver={(e) => handleDragOver(e, bayNum)}
                  onDragLeave={() => handleDragLeave(bayNum)}
                  onDrop={(e) => {
                    e.stopPropagation();
                    handleDrop(e, bayNum);
                  }}
                  className={`relative flex flex-col items-center justify-between p-2 rounded-2xl border transition-all duration-200 min-h-[310px] w-28 md:w-32 shrink-0 ${
                    isOver
                      ? 'bg-blue-950/80 border-[#FFA300] ring-2 ring-[#FFA300] shadow-lg scale-[1.02]'
                      : vehicle
                      ? 'bg-slate-800/80 border-slate-700 hover:border-slate-500'
                      : 'bg-slate-900/40 border-dashed border-slate-700/80 hover:border-blue-400/80'
                  }`}
                >
                  {/* Top Bay Label & Roll-Up Industrial Door Visual */}
                  <div className="w-full flex flex-col items-center mb-1">
                    <div className="flex items-center justify-between w-full px-1 text-[11px] font-bold text-slate-300">
                      <span>رصيف {bayNum}</span>
                      {vehicle ? (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="مشغول" />
                      ) : (
                        <span className="text-[10px] text-slate-500 font-normal">شاغر</span>
                      )}
                    </div>

                    {/* Industrial Roll-up Shutter Graphic */}
                    <div className="w-full h-5 mt-1 bg-slate-950 border border-slate-700 rounded-md flex flex-col justify-around px-1 overflow-hidden opacity-80">
                      <div className="h-0.5 bg-slate-700 w-full" />
                      <div className="h-0.5 bg-slate-700 w-full" />
                      <div className="h-0.5 bg-slate-700 w-full" />
                    </div>
                  </div>

                  {/* Slot Body: Parked Vehicle Card or Empty Bay Affordance */}
                  <div className="flex-1 w-full flex items-center justify-center my-1">
                    {vehicle ? (
                      <VehicleCard
                        vehicle={vehicle}
                        displayMode="bay"
                        onMoveToSection={onMoveToSection}
                        onSelectVehicle={onSelectVehicle}
                        isDragging={activeDragId === vehicle.id}
                      />
                    ) : (
                      <div
                        onClick={() => onAddNewToBay(bayNum)}
                        className="group w-full h-full flex flex-col items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-slate-700 hover:border-[#FFA300] hover:bg-blue-900/20 cursor-pointer transition-all"
                      >
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-[#FFA300] group-hover:bg-[#002D72] transition-all">
                          <Plus className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] text-slate-400 group-hover:text-amber-300 text-center font-bold">
                          إضافة شاحنة
                        </span>
                        <span className="text-[9px] text-slate-500 text-center">
                          أو اسحب لرصيف {bayNum}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Ground Parking Lines */}
                  <div className="w-full pt-1 border-t border-slate-700/60 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                    <span className="text-yellow-500/70">|||</span>
                    <span>BAY-{bayNum < 10 ? `0${bayNum}` : bayNum}</span>
                    <span className="text-yellow-500/70">|||</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
