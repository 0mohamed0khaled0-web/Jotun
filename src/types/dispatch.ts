export type VehicleSection = 'yard' | 'requested' | 'inside' | 'exited';

// Updated types matching user requirements: تريلا (Trella), جامبو (Jumbo), دبابة (Dababa)
export type VehicleType = 'trella' | 'jumbo' | 'dababa';

export interface Vehicle {
  id: string;
  plateNumber: string;        // Numeric only, e.g. "1234" or "٥٦٧٨"
  plateDigits: string;        // Pure digits
  plateLetters?: string;      // Deprecated / omitted
  driverName: string;         // e.g. "أحمد علي"
  driverPhone: string;        // e.g. "01012345678"
  vehicleType: VehicleType;   // 'trella' | 'jumbo' | 'dababa'
  modelName: string;          // e.g. "تريلا مرسيدس أكتروس"
  color: string;              // e.g. "#002D72"
  section: VehicleSection;
  bayNumber?: number;         // 1 to 99 for yard bays
  cargoType: string;          // e.g. "دهانات جوتن فينوماستيك"
  targetWarehouse?: string;   // e.g. "عنبر التعبئة والتحميل"
  entryTime: string;          // e.g. "09:30 ص"
  calledTime?: string;        // when moved to 'requested'
  insideTime?: string;        // when moved to 'inside'
  notes?: string;
  loadWeightKg?: number;      // e.g. 15000
}

export interface ActivityLog {
  id: string;
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  fromSection: VehicleSection;
  toSection: VehicleSection;
  timestamp: string;
  actionNote: string;
}

// Factory limits per user specification
export const FACTORY_INSIDE_LIMITS: Record<VehicleType, number> = {
  trella: 3,  // حد أقصى 3 تريلا داخل المصنع
  jumbo: 5,   // حد أقصى 5 جامبو داخل المصنع
  dababa: 3,  // حد أقصى 3 دبابة داخل المصنع
};

// Outside yard maximum capacity
export const YARD_MAX_CAPACITY = 99;

export const VEHICLE_TYPE_LABELS: Record<VehicleType, { nameAr: string; desc: string; icon: string }> = {
  trella: {
    nameAr: 'تريلا (قاطرة ومقطورة)',
    desc: 'شاحنة نقل ثقيل 40 قدم لنقل باليتات ودهانات جوتن',
    icon: '🚛',
  },
  jumbo: {
    nameAr: 'عربية جامبو',
    desc: 'سيارة نقل صندوق مغلق متوسطة سعة 7-10 طن',
    icon: '🚚',
  },
  dababa: {
    nameAr: 'عربية دبابة',
    desc: 'سيارة نصف نقل / ربع نقل شيفروليه دبابة للطلبيات السريعة',
    icon: '🛻',
  },
};
