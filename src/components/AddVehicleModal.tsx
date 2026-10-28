import React, { useState } from 'react';
import { Vehicle, VehicleSection, VehicleType, VEHICLE_TYPE_LABELS, YARD_MAX_CAPACITY } from '../types/dispatch';
import { LicensePlate } from './LicensePlate';
import { VehicleGraphic } from './VehicleGraphic';
import { X, Truck, User, Phone, Package, Warehouse, Hash, Check } from 'lucide-react';

interface AddVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddVehicle: (newVehicle: Omit<Vehicle, 'id' | 'entryTime'>) => void;
  defaultSection?: VehicleSection;
  defaultBay?: number;
  availableBays: number[];
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onAddVehicle,
  defaultSection = 'yard',
  defaultBay,
  availableBays,
}) => {
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('010');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('trella');
  const [modelName, setModelName] = useState('تريلا مرسيدس أكتروس 40 قدم');
  const [color, setColor] = useState('#002D72');
  const [section, setSection] = useState<VehicleSection>(defaultSection);
  const [bayNumber, setBayNumber] = useState<number | undefined>(defaultBay || availableBays[0] || 1);
  const [cargoType, setCargoType] = useState('دهانات جوتن فينوماستيك');
  const [targetWarehouse, setTargetWarehouse] = useState('عنبر التحميل والتعتيق الرئيسي');
  const [loadWeightKg, setLoadWeightKg] = useState<number>(18000);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Clean numbers only (keep Arabic and Western digits)
  const handlePlateChange = (val: string) => {
    const cleaned = val.replace(/[^\d\u0660-\u0669]/g, '');
    setPlateNumber(cleaned);
  };

  const handleSelectType = (t: VehicleType) => {
    setVehicleType(t);
    if (t === 'trella') {
      setModelName('تريلا مرسيدس أكتروس 40 قدم');
      setColor('#002D72');
      setCargoType('باليتات دهانات جوتن فينوماستيك وجوتاشيلد');
      setLoadWeightKg(20000);
    } else if (t === 'jumbo') {
      setModelName('عربية جامبو إيسوزو صندوق مقفل');
      setColor('#FFFFFF');
      setCargoType('بويات وبراميل دهانات جوتن جاهزة');
      setLoadWeightKg(6500);
    } else if (t === 'dababa') {
      setModelName('عربية دبابة شيفروليه T-Series');
      setColor('#94A3B8');
      setCargoType('جالونات وبستلات ألوان تلوين كمبيوتر');
      setLoadWeightKg(1500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName.trim()) {
      alert('يرجى إدخال اسم السائق');
      return;
    }
    if (!plateNumber.trim()) {
      alert('يرجى إدخال رقم اللوحة (أرقام فقط)');
      return;
    }

    onAddVehicle({
      plateNumber: plateNumber.trim(),
      plateDigits: plateNumber.trim(),
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      vehicleType,
      modelName,
      color,
      section,
      bayNumber: section === 'yard' ? (bayNumber || 1) : undefined,
      cargoType: cargoType.trim(),
      targetWarehouse: targetWarehouse.trim(),
      loadWeightKg,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        dir="rtl"
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header with Jotun Styling */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#002D72] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FFA300] shadow-sm">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">تسجيل وإضافة عربية جديدة (مصنع جوتن)</h3>
              <p className="text-xs text-blue-200">لوحات أرقام فقط · فئات: تريلا، جامبو، دبابة</p>
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

        {/* Live Plate Preview (Numbers Only) & Selected Vehicle Preview */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">معاينة اللوحة (أرقام فقط):</span>
            <LicensePlate
              digits={plateNumber || '1234'}
              size="md"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">الفئة المختارة:</span>
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-[#002D72] text-white">
              {VEHICLE_TYPE_LABELS[vehicleType].nameAr.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-right">
          {/* VEHICLE TYPE SELECTOR: 3 SPECIFIC TYPES (تريلا، جامبو، دبابة) */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-2">
              اختر نوع وفئة الشاحنة *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {/* Option 1: تريلا */}
              <button
                type="button"
                onClick={() => handleSelectType('trella')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                  vehicleType === 'trella'
                    ? 'border-[#002D72] bg-blue-50/80 ring-2 ring-[#002D72]/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-full h-12 flex items-center justify-center my-0.5">
                  <VehicleGraphic type="trella" view="side" color="#002D72" />
                </div>
                <span className="text-xs font-black text-slate-900 mt-1">تريلا</span>
                <span className="text-[10px] text-slate-500">نقل ثقيل / 40 قدم</span>
              </button>

              {/* Option 2: جامبو */}
              <button
                type="button"
                onClick={() => handleSelectType('jumbo')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                  vehicleType === 'jumbo'
                    ? 'border-[#002D72] bg-blue-50/80 ring-2 ring-[#002D72]/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-full h-12 flex items-center justify-center my-0.5">
                  <VehicleGraphic type="jumbo" view="side" color="#FFFFFF" />
                </div>
                <span className="text-xs font-black text-slate-900 mt-1">عربية جامبو</span>
                <span className="text-[10px] text-slate-500">صندوق مغلق / إيسوزو</span>
              </button>

              {/* Option 3: دبابة */}
              <button
                type="button"
                onClick={() => handleSelectType('dababa')}
                className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-between text-center transition-all cursor-pointer ${
                  vehicleType === 'dababa'
                    ? 'border-[#002D72] bg-blue-50/80 ring-2 ring-[#002D72]/20 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-full h-12 flex items-center justify-center my-0.5">
                  <VehicleGraphic type="dababa" view="side" color="#94A3B8" />
                </div>
                <span className="text-xs font-black text-slate-900 mt-1">عربية دبابة</span>
                <span className="text-[10px] text-slate-500">نصف نقل / شيفروليه</span>
              </button>
            </div>
          </div>

          {/* License Plate Number Input (NUMBERS ONLY) & Driver Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                رقم لوحة السيارة (أرقام فقط) *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: 1234 أو ٥٦٧٨"
                  value={plateNumber}
                  onChange={(e) => handlePlateChange(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#002D72] font-mono font-bold text-slate-900"
                />
                <Hash className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                ملاحظة: تم إلغاء الحروف، أرقام فقط حسب تعليمات إدارة جوتن
              </span>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                اسم السائق *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد علي"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#002D72] font-medium"
                />
                <User className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Driver Phone & Model details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                رقم هاتف السائق
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="010XXXXXXXX"
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-sm text-right bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#002D72] font-mono"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                طراز المركبة ولونها
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-9 p-0.5 border border-slate-300 rounded-xl cursor-pointer shrink-0"
                />
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="الموديل"
                  className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#002D72]"
                />
              </div>
            </div>
          </div>

          {/* Initial Destination / Placement Section */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="block text-xs font-black text-slate-800 mb-2">
              التسكين الأولي للشاحنة:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSection('yard')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  section === 'yard'
                    ? 'bg-[#002D72] text-white border-[#002D72] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                خارج المصنع (ساحة)
              </button>
              <button
                type="button"
                onClick={() => setSection('requested')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  section === 'requested'
                    ? 'bg-red-600 text-white border-red-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                مطلوب فوراً
              </button>
              <button
                type="button"
                onClick={() => setSection('inside')}
                className={`py-2 px-3 text-xs font-bold rounded-xl border text-center transition-all cursor-pointer ${
                  section === 'inside'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                داخل المصنع مباشرة
              </button>
            </div>

            {/* Bay selection for 1-99 */}
            {section === 'yard' && (
              <div className="mt-3 flex items-center gap-3">
                <span className="text-xs text-slate-700 font-bold">رقم رصيف الساحة (1 - 99):</span>
                <input
                  type="number"
                  min={1}
                  max={YARD_MAX_CAPACITY}
                  value={bayNumber || 1}
                  onChange={(e) => setBayNumber(Math.min(99, Math.max(1, parseInt(e.target.value, 10) || 1)))}
                  className="w-24 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold font-mono text-center focus:outline-hidden focus:border-[#002D72]"
                />
                <span className="text-[11px] text-slate-400">
                  (سعة الساحة حتى 99 رصيف)
                </span>
              </div>
            )}
          </div>

          {/* Cargo Type (Jotun Paints) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                نوع الحمولة وبويات جوتن
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: دهانات جوتن فينوماستيك، جوتاشيلد..."
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#002D72]"
                />
                <Package className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-800 mb-1">
                عنبر / رصيف المستودع المستهدف
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثال: عنبر التحميل الرئيسي 1"
                  value={targetWarehouse}
                  onChange={(e) => setTargetWarehouse(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#002D72]"
                />
                <Warehouse className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-black text-slate-800 mb-1">
              ملاحظات إضافية
            </label>
            <input
              type="text"
              placeholder="مثال: معتمد أوراق فحص السلامة..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#002D72]"
            />
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-black text-white bg-[#002D72] hover:bg-[#001f52] rounded-xl shadow-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#FFA300]" />
              <span>حفظ وتثبيت العربية في النظام</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
