import React from 'react';
import { Vehicle, VehicleSection, VEHICLE_TYPE_LABELS } from '../types/dispatch';
import { LicensePlate } from './LicensePlate';
import { VehicleGraphic, TrellaIcon, JumboIcon, DababaIcon } from './VehicleGraphic';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  GripVertical
} from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  displayMode?: 'bay' | 'side-card' | 'compact';
  onMoveToSection: (vehicleId: string, targetSection: VehicleSection) => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
  onOpenQuickMenu?: (vehicle: Vehicle) => void;
  isDragging?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  displayMode = 'side-card',
  onMoveToSection,
  onSelectVehicle,
  isDragging = false,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ vehicleId: vehicle.id, fromSection: vehicle.section }));
    e.dataTransfer.setData('text/plain', vehicle.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const typeConfig = VEHICLE_TYPE_LABELS[vehicle.vehicleType] || {
    nameAr: 'شاحنة',
    desc: '',
    icon: '🚚',
  };

  const getNextAction = () => {
    switch (vehicle.section) {
      case 'yard':
        return {
          target: 'requested' as VehicleSection,
          label: 'استدعاء (مطلوب)',
          color: 'bg-red-600 hover:bg-red-700 text-white',
          icon: <ArrowLeft className="w-3.5 h-3.5" />,
        };
      case 'requested':
        return {
          target: 'inside' as VehicleSection,
          label: 'إدخال للمصنع',
          color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          icon: <ArrowLeft className="w-3.5 h-3.5" />,
        };
      case 'inside':
        return {
          target: 'exited' as VehicleSection,
          label: 'تسجيل خروج',
          color: 'bg-slate-800 hover:bg-slate-900 text-white',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      default:
        return null;
    }
  };

  const getPrevAction = () => {
    switch (vehicle.section) {
      case 'requested':
        return {
          target: 'yard' as VehicleSection,
          label: 'إرجاع للساحة',
          color: 'bg-slate-200 hover:bg-slate-300 text-slate-700',
          icon: <ArrowRight className="w-3.5 h-3.5" />,
        };
      case 'inside':
        return {
          target: 'requested' as VehicleSection,
          label: 'إرجاع للمطلوب',
          color: 'bg-amber-100 hover:bg-amber-200 text-amber-800',
          icon: <ArrowRight className="w-3.5 h-3.5" />,
        };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();
  const prevAction = getPrevAction();

  // BAY DISPLAY MODE (for lined-up vehicles in "خارج المصنع")
  if (displayMode === 'bay') {
    return (
      <div
        draggable
        onDragStart={handleDragStart}
        onClick={() => onSelectVehicle(vehicle)}
        className={`group relative flex flex-col items-center justify-between w-28 md:w-32 py-2 px-1 rounded-xl border transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-lg select-none ${
          isDragging 
            ? 'opacity-40 scale-95 border-dashed border-blue-400 bg-blue-50' 
            : 'bg-white/95 backdrop-blur-xs border-slate-200 hover:border-amber-400 shadow-xs'
        }`}
      >
        {/* Top Tag: Driver Name & Number-Only Plate Header */}
        <div className="w-full text-center pb-1 border-b border-slate-100">
          <div className="text-[11px] font-bold text-slate-800 truncate px-1" title={vehicle.driverName}>
            {vehicle.driverName}
          </div>
          <div className="mt-0.5 flex justify-center">
            <LicensePlate 
              digits={vehicle.plateDigits || vehicle.plateNumber} 
              plateNumber={vehicle.plateNumber}
              size="sm" 
            />
          </div>
          {/* Vehicle Type Mini Badge */}
          <div className="mt-1 flex items-center justify-center gap-1">
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-[#002D72] border border-slate-200 truncate max-w-[90px]">
              {typeConfig.nameAr.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Vehicle Top-Down Graphic in Bay */}
        <div className="w-20 h-36 my-1.5 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
          <VehicleGraphic type={vehicle.vehicleType} view="top-down" color={vehicle.color} />
        </div>

        {/* Quick Action Button & Details */}
        <div className="w-full flex flex-col items-center gap-1 pt-1 border-t border-slate-100">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveToSection(vehicle.id, 'requested');
            }}
            className="w-full py-1 px-1.5 text-[10px] font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            title="نقل إلى مطلوب فوراً"
          >
            <span>استدعاء</span>
            <ArrowLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Drag Affordance Indicator */}
        <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-60 transition-opacity">
          <GripVertical className="w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>
    );
  }

  // SIDE-CARD MODE (Used in "مطلوب" and "داخل المصنع")
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onSelectVehicle(vehicle)}
      className={`group relative flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-2xl border-2 transition-all duration-200 cursor-grab active:cursor-grabbing hover:shadow-md select-none ${
        vehicle.section === 'requested'
          ? 'bg-red-50/70 border-red-300 hover:border-red-500'
          : vehicle.section === 'inside'
          ? 'bg-emerald-50/70 border-emerald-300 hover:border-emerald-500'
          : 'bg-white border-slate-200 hover:border-[#002D72]'
      } ${isDragging ? 'opacity-40 scale-95 border-dashed' : ''}`}
    >
      {/* Drag Grip Indicator */}
      <div className="hidden md:flex items-center text-slate-300 group-hover:text-slate-500">
        <GripVertical className="w-4 h-4" />
      </div>

      {/* Vehicle Side Profile Graphic */}
      <div className="w-40 md:w-48 h-20 shrink-0 flex items-center justify-center">
        <VehicleGraphic type={vehicle.vehicleType} view="side" color={vehicle.color} />
      </div>

      {/* Info: Driver Name, License Plate (Numbers Only) & Load */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-right gap-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap justify-center md:justify-start">
          <LicensePlate 
            digits={vehicle.plateDigits || vehicle.plateNumber} 
            plateNumber={vehicle.plateNumber}
            size="md" 
          />
          <span className="text-xs font-bold text-slate-900 truncate">
            {vehicle.driverName}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#002D72]/10 text-[#002D72] border border-[#002D72]/20">
            {typeConfig.nameAr.split(' ')[0]}
          </span>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 flex-wrap justify-center md:justify-start">
          <span className="font-semibold text-slate-700">{vehicle.modelName}</span>
          <span>·</span>
          <span className="text-slate-600 font-medium truncate max-w-[200px]">{vehicle.cargoType}</span>
        </div>

        {/* Timestamps */}
        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
          <Clock className="w-3 h-3 text-slate-400" />
          <span>الدخول: {vehicle.entryTime}</span>
          {vehicle.calledTime && <span>· طُلب: {vehicle.calledTime}</span>}
          {vehicle.insideTime && <span>· الدخول الفعلي: {vehicle.insideTime}</span>}
        </div>
      </div>

      {/* Action Buttons for Click-to-Move */}
      <div className="flex items-center gap-1.5 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/60">
        {prevAction && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveToSection(vehicle.id, prevAction.target);
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${prevAction.color}`}
            title={prevAction.label}
          >
            {prevAction.icon}
            <span className="text-[11px]">{prevAction.label}</span>
          </button>
        )}

        {nextAction && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMoveToSection(vehicle.id, nextAction.target);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer ${nextAction.color}`}
            title={nextAction.label}
          >
            <span className="text-[11px]">{nextAction.label}</span>
            {nextAction.icon}
          </button>
        )}
      </div>
    </div>
  );
};
