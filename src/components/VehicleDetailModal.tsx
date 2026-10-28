import React, { useState } from 'react';
import { Vehicle, VehicleSection, VEHICLE_TYPE_LABELS } from '../types/dispatch';
import { LicensePlate } from './LicensePlate';
import { VehicleGraphic } from './VehicleGraphic';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Phone, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Warehouse, 
  Package, 
  Truck,
  Send,
  AlertTriangle
} from 'lucide-react';

interface VehicleDetailModalProps {
  vehicle: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  onMoveToSection: (vehicleId: string, targetSection: VehicleSection, bayNumber?: number) => void;
  onRemoveVehicle: (vehicleId: string) => void;
  onUpdateVehicle: (updated: Vehicle) => void;
}

export const VehicleDetailModal: React.FC<VehicleDetailModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  onMoveToSection,
  onRemoveVehicle,
  onUpdateVehicle,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [notes, setNotes] = useState('');
  const [callNotification, setCallNotification] = useState<string | null>(null);

  if (!isOpen || !vehicle) return null;

  const handleStartEdit = () => {
    setDriverName(vehicle.driverName);
    setDriverPhone(vehicle.driverPhone);
    setCargoType(vehicle.cargoType);
    setNotes(vehicle.notes || '');
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    onUpdateVehicle({
      ...vehicle,
      driverName,
      driverPhone,
      cargoType,
      notes,
    });
    setIsEditing(false);
  };

  const handleSimulateCall = () => {
    setCallNotification(`جاري الاتصال بالسائق ${vehicle.driverName} على الرقم ${vehicle.driverPhone}...`);
    setTimeout(() => {
      setCallNotification(`تم إرسال إشعار SMS وتنبيه صوتي للسائق بالتحرك فوراً إلى رصيف التحميل.`);
      setTimeout(() => setCallNotification(null), 4000);
    }, 1800);
  };

  const sectionLabels: Record<VehicleSection, { label: string; color: string }> = {
    yard: { label: `خارج المصنع (رصيف ${vehicle.bayNumber || '-'})`, color: 'bg-[#002D72] text-white' },
    requested: { label: 'مطلوب (الاستدعاء للتحميل)', color: 'bg-red-600 text-white' },
    inside: { label: 'داخل المصنع (جاري التحميل والتعتيق)', color: 'bg-emerald-600 text-white' },
    exited: { label: 'تم الخروج (مكتمل)', color: 'bg-slate-700 text-white' },
  };

  const typeInfo = VEHICLE_TYPE_LABELS[vehicle.vehicleType] || {
    nameAr: 'شاحنة',
    desc: '',
    icon: '🚚',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        dir="rtl"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#002D72] text-white">
          <div className="flex items-center gap-3">
            <LicensePlate
              digits={vehicle.plateDigits || vehicle.plateNumber}
              plateNumber={vehicle.plateNumber}
              size="md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">{vehicle.driverName}</h3>
                <span className="text-[10px] font-bold bg-[#FFA300] text-slate-950 px-2 py-0.2 rounded-full">
                  {typeInfo.nameAr.split(' ')[0]}
                </span>
              </div>
              <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 ${sectionLabels[vehicle.section].color}`}>
                {sectionLabels[vehicle.section].label}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-blue-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Graphic Showcase with Type Banner */}
        <div className="bg-slate-50 p-4 border-b border-slate-200 flex flex-col items-center justify-center">
          <div className="w-64 h-28 flex items-center justify-center">
            <VehicleGraphic type={vehicle.vehicleType} view="side" color={vehicle.color} />
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs font-bold text-slate-700">{vehicle.modelName}</span>
            <span className="text-[11px] text-slate-400">·</span>
            <span className="text-[11px] text-slate-500 font-medium">{typeInfo.desc}</span>
          </div>
        </div>

        {/* Notification Toast */}
        {callNotification && (
          <div className="mx-6 mt-3 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <Send className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{callNotification}</span>
          </div>
        )}

        {/* Quick Action Navigation Buttons */}
        <div className="p-4 bg-slate-50 border-b border-slate-200">
          <span className="block text-xs font-bold text-slate-700 mb-2">
            نقل سريع بضغطة زر إلى:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              disabled={vehicle.section === 'yard'}
              onClick={() => {
                onMoveToSection(vehicle.id, 'yard');
                onClose();
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                vehicle.section === 'yard'
                  ? 'opacity-40 bg-slate-200 text-slate-400 border-transparent cursor-not-allowed'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-xs'
              }`}
            >
              <Warehouse className="w-4 h-4" />
              <span>خارج المصنع</span>
            </button>

            <button
              type="button"
              disabled={vehicle.section === 'requested'}
              onClick={() => {
                onMoveToSection(vehicle.id, 'requested');
                onClose();
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                vehicle.section === 'requested'
                  ? 'opacity-40 bg-red-100 text-red-400 border-transparent cursor-not-allowed'
                  : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100 shadow-xs'
              }`}
            >
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>مطلوب فوراً</span>
            </button>

            <button
              type="button"
              disabled={vehicle.section === 'inside'}
              onClick={() => {
                onMoveToSection(vehicle.id, 'inside');
                onClose();
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                vehicle.section === 'inside'
                  ? 'opacity-40 bg-emerald-100 text-emerald-400 border-transparent cursor-not-allowed'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 shadow-xs'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>داخل المصنع</span>
            </button>

            <button
              type="button"
              disabled={vehicle.section === 'exited'}
              onClick={() => {
                onMoveToSection(vehicle.id, 'exited');
                onClose();
              }}
              className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 cursor-pointer ${
                vehicle.section === 'exited'
                  ? 'opacity-40 bg-slate-200 text-slate-400 border-transparent cursor-not-allowed'
                  : 'bg-slate-800 text-white border-slate-800 hover:bg-slate-900 shadow-xs'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تسجيل خروج</span>
            </button>
          </div>
        </div>

        {/* Content Details Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">اسم السائق</label>
                <input
                  type="text"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">رقم الهاتف</label>
                <input
                  type="text"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">نوع الحمولة / بويات جوتن</label>
                <input
                  type="text"
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ملاحظات</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-[#002D72] rounded-xl hover:bg-[#001f52]"
                >
                  حفظ التعديلات
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">رقم هاتف السائق:</span>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-mono text-sm">{vehicle.driverPhone}</span>
                    <button
                      type="button"
                      onClick={handleSimulateCall}
                      className="p-1.5 rounded-lg bg-blue-100 hover:bg-blue-200 text-[#002D72] cursor-pointer"
                      title="اتصال بالسائق"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">وقت تسجيل الدخول:</span>
                  <span className="font-bold text-slate-900 flex items-center gap-1 text-sm">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{vehicle.entryTime}</span>
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 col-span-2">
                  <span className="text-slate-500 block mb-0.5">بيانات الحمولة والمستودع:</span>
                  <span className="font-black text-slate-900 block text-sm">{vehicle.cargoType}</span>
                  {vehicle.targetWarehouse && (
                    <span className="text-[11px] text-slate-500 mt-1 block">
                      المستودع / العنبر: {vehicle.targetWarehouse}
                    </span>
                  )}
                </div>

                {vehicle.notes && (
                  <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 col-span-2 text-amber-900">
                    <span className="font-bold block mb-0.5 text-[11px]">ملاحظات التشغيل:</span>
                    <span>{vehicle.notes}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50 border-t border-slate-200">
          <button
            type="button"
            onClick={() => {
              if (confirm(`هل أنت متأكد من حذف العربية رقم ${vehicle.plateNumber}؟`)) {
                onRemoveVehicle(vehicle.id);
                onClose();
              }
            }}
            className="text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer transition-colors font-bold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف من النظام</span>
          </button>

          {!isEditing && (
            <button
              type="button"
              onClick={handleStartEdit}
              className="text-xs text-slate-700 hover:text-slate-900 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-300 flex items-center gap-1.5 cursor-pointer transition-colors font-bold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>تعديل البيانات</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
