import React, { useState, useEffect, useMemo } from 'react';
import { 
  Vehicle, 
  VehicleSection, 
  VehicleType, 
  ActivityLog, 
  FACTORY_INSIDE_LIMITS, 
  YARD_MAX_CAPACITY,
  VEHICLE_TYPE_LABELS 
} from './types/dispatch';
import { INITIAL_VEHICLES } from './data/mockVehicles';
import { YardBayGrid } from './components/YardBayGrid';
import { DispatchZones } from './components/DispatchZones';
import { AddVehicleModal } from './components/AddVehicleModal';
import { VehicleDetailModal } from './components/VehicleDetailModal';
import { MovementLogModal } from './components/MovementLogModal';
import { VisualGuideOverlay } from './components/VisualGuideOverlay';
import { LoginModal } from './components/LoginModal';
import { CapacityLimitModal } from './components/CapacityLimitModal';
import { playSound } from './utils/sound';
import { 
  Plus, 
  Search, 
  History, 
  RotateCcw, 
  LogOut, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Truck, 
  Warehouse, 
  Clock, 
  Filter,
  User,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface AuthUser {
  username: string;
  displayName: string;
  role: string;
}

export default function App() {
  // Authentication State
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem('jotun_auth_session');
      if (savedUser) return JSON.parse(savedUser);
    } catch {
      // fallback
    }
    // Default to authenticated for instant smooth preview, or user can log out
    return {
      username: 'jotun',
      displayName: 'م. أحمد عبد الرحمن (مشرف ديسباتش جوتن)',
      role: 'مشرف حركة الساحات والشحن',
    };
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Load state from localStorage or default to INITIAL_VEHICLES
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem('jotun_dispatch_vehicles_v2');
      if (saved) {
        const parsed: Vehicle[] = JSON.parse(saved);
        // Ensure plate numbers are pure digits and vehicle types match trella/jumbo/dababa
        if (parsed.length > 0 && (parsed[0].vehicleType === 'trella' || parsed[0].vehicleType === 'jumbo' || parsed[0].vehicleType === 'dababa')) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_VEHICLES;
  });

  const [logs, setLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem('jotun_dispatch_logs_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'log-1',
        vehicleId: 'veh-req-1',
        plateNumber: '4455',
        driverName: 'أحمد علي',
        fromSection: 'yard',
        toSection: 'requested',
        timestamp: '09:45 ص',
        actionNote: 'تم استدعاء عربية جامبو رقم 4455 لقائمة المطلوب',
      },
      {
        id: 'log-2',
        vehicleId: 'veh-in-1',
        plateNumber: '1092',
        driverName: 'كريم صلاح',
        fromSection: 'requested',
        toSection: 'inside',
        timestamp: '08:35 ص',
        actionNote: 'دخول تريلا رقم 1092 للمصنع لبدء تحميل بويات جوتن',
      },
    ];
  });

  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<'all' | VehicleType>('all');
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [showGuideArrows, setShowGuideArrows] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [addModalSection, setAddModalSection] = useState<VehicleSection>('yard');
  const [addModalBay, setAddModalBay] = useState<number | undefined>(undefined);
  const [showExitedDrawer, setShowExitedDrawer] = useState(false);

  // Capacity Limits Alert Modal State (3 Trella, 5 Jumbo, 3 Dababa)
  const [capacityBlockedType, setCapacityBlockedType] = useState<VehicleType | null>(null);
  const [isCapacityModalOpen, setIsCapacityModalOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('jotun_dispatch_vehicles_v2', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('jotun_dispatch_logs_v2', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem('jotun_auth_session', JSON.stringify(authUser));
    } else {
      localStorage.removeItem('jotun_auth_session');
    }
  }, [authUser]);

  // Audio helper
  const triggerSound = (type: 'drag' | 'drop' | 'call' | 'complete' | 'click' | 'warning') => {
    if (soundEnabled) {
      playSound(type);
    }
  };

  // Find available bay slots (1-99)
  const availableBays = useMemo(() => {
    const occupiedBays = vehicles
      .filter((v) => v.section === 'yard' && v.bayNumber)
      .map((v) => v.bayNumber as number);
    const all = Array.from({ length: YARD_MAX_CAPACITY }, (_, i) => i + 1);
    return all.filter((b) => !occupiedBays.includes(b));
  }, [vehicles]);

  // Inside counts breakdown
  const currentInsideCounts: Record<VehicleType, number> = useMemo(() => {
    const counts = { trella: 0, jumbo: 0, dababa: 0 };
    vehicles.forEach((v) => {
      if (v.section === 'inside') {
        if (counts[v.vehicleType] !== undefined) {
          counts[v.vehicleType]++;
        }
      }
    });
    return counts;
  }, [vehicles]);

  // Section filtered vehicles with search & vehicle type filter
  const yardVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (v.section !== 'yard') return false;
      if (selectedTypeFilter !== 'all' && v.vehicleType !== selectedTypeFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        v.plateNumber.includes(q) ||
        v.driverName.toLowerCase().includes(q) ||
        v.cargoType.toLowerCase().includes(q) ||
        v.modelName.toLowerCase().includes(q)
      );
    });
  }, [vehicles, searchQuery, selectedTypeFilter]);

  const requestedVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (v.section !== 'requested') return false;
      if (selectedTypeFilter !== 'all' && v.vehicleType !== selectedTypeFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        v.plateNumber.includes(q) ||
        v.driverName.toLowerCase().includes(q) ||
        v.cargoType.toLowerCase().includes(q)
      );
    });
  }, [vehicles, searchQuery, selectedTypeFilter]);

  const insideVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      if (v.section !== 'inside') return false;
      if (selectedTypeFilter !== 'all' && v.vehicleType !== selectedTypeFilter) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        v.plateNumber.includes(q) ||
        v.driverName.toLowerCase().includes(q) ||
        v.cargoType.toLowerCase().includes(q)
      );
    });
  }, [vehicles, searchQuery, selectedTypeFilter]);

  const exitedVehicles = useMemo(() => {
    return vehicles.filter((v) => v.section === 'exited');
  }, [vehicles]);

  // CORE LOGIC: Move vehicle between sections (with strict limits for inside factory)
  const handleMoveToSection = (vehicleId: string, targetSection: VehicleSection, specificBay?: number) => {
    const targetVehicle = vehicles.find((v) => v.id === vehicleId);
    if (!targetVehicle) return;

    if (targetVehicle.section === targetSection && targetSection !== 'yard') {
      return;
    }

    // STRICT CHECK: Inside Factory Capacity Limits (3 Trella, 5 Jumbo, 3 Dababa)
    if (targetSection === 'inside' && targetVehicle.section !== 'inside') {
      const currentCountOfType = vehicles.filter(
        (v) => v.section === 'inside' && v.vehicleType === targetVehicle.vehicleType && v.id !== vehicleId
      ).length;

      const maxAllowed = FACTORY_INSIDE_LIMITS[targetVehicle.vehicleType];

      if (currentCountOfType >= maxAllowed) {
        // Block movement! Exceeded quota
        setCapacityBlockedType(targetVehicle.vehicleType);
        setIsCapacityModalOpen(true);
        triggerSound('warning');
        return;
      }
    }

    // Check outside yard capacity (Max 99)
    if (targetSection === 'yard' && targetVehicle.section !== 'yard') {
      const yardCount = vehicles.filter((v) => v.section === 'yard' && v.id !== vehicleId).length;
      if (yardCount >= YARD_MAX_CAPACITY) {
        alert('عفواً، اكتملت السعة القصوى لساحة الانتظار الخارجية (99 سيارة)!');
        triggerSound('warning');
        return;
      }
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    // Determine bay if moving back to yard
    let finalBay = specificBay;
    if (targetSection === 'yard' && !finalBay) {
      if (targetVehicle.bayNumber && !vehicles.some((v) => v.section === 'yard' && v.bayNumber === targetVehicle.bayNumber && v.id !== vehicleId)) {
        finalBay = targetVehicle.bayNumber;
      } else {
        finalBay = availableBays[0] || 1;
      }
    }

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            section: targetSection,
            bayNumber: targetSection === 'yard' ? finalBay : undefined,
            calledTime: targetSection === 'requested' ? timeString : v.calledTime,
            insideTime: targetSection === 'inside' ? timeString : v.insideTime,
          };
        }
        // If placing into an already occupied bay, bump existing to another available bay
        if (targetSection === 'yard' && specificBay && v.bayNumber === specificBay && v.section === 'yard' && v.id !== vehicleId) {
          const nextBay = availableBays.find((b) => b !== specificBay) || 1;
          return { ...v, bayNumber: nextBay };
        }
        return v;
      })
    );

    // Audio cue
    if (targetSection === 'requested') triggerSound('call');
    else if (targetSection === 'inside') triggerSound('drop');
    else if (targetSection === 'exited') triggerSound('complete');
    else triggerSound('click');

    // Add activity log
    const typeLabel = VEHICLE_TYPE_LABELS[targetVehicle.vehicleType].nameAr.split(' ')[0];
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      vehicleId: targetVehicle.id,
      plateNumber: targetVehicle.plateNumber,
      driverName: targetVehicle.driverName,
      fromSection: targetVehicle.section,
      toSection: targetSection,
      timestamp: timeString,
      actionNote: `تم نقل ${typeLabel} رقم ${targetVehicle.plateNumber} (${targetVehicle.driverName}) إلى ${
        targetSection === 'yard' ? `رصيف ${finalBay}` : targetSection === 'requested' ? 'مطلوب' : targetSection === 'inside' ? 'داخل المصنع' : 'تم الخروج'
      }`,
    };

    setLogs((prev) => [newLog, ...prev]);
  };

  // Fast exit oldest vehicle of specific type to free up space
  const handleExitFirstVehicleOfType = (type: VehicleType) => {
    const vehicleToExit = vehicles.find((v) => v.section === 'inside' && v.vehicleType === type);
    if (vehicleToExit) {
      handleMoveToSection(vehicleToExit.id, 'exited');
    }
  };

  // Add new vehicle
  const handleAddVehicle = (newVehicleData: Omit<Vehicle, 'id' | 'entryTime'>) => {
    // Check yard capacity if adding to yard
    if (newVehicleData.section === 'yard') {
      const yardCount = vehicles.filter((v) => v.section === 'yard').length;
      if (yardCount >= YARD_MAX_CAPACITY) {
        alert('عفواً، وصلت الساحة الخارجية للحد الأقصى (99 سيارة)!');
        triggerSound('warning');
        return;
      }
    }

    // Check inside capacity if adding directly to inside
    if (newVehicleData.section === 'inside') {
      const insideCountOfType = vehicles.filter(
        (v) => v.section === 'inside' && v.vehicleType === newVehicleData.vehicleType
      ).length;
      if (insideCountOfType >= FACTORY_INSIDE_LIMITS[newVehicleData.vehicleType]) {
        setCapacityBlockedType(newVehicleData.vehicleType);
        setIsCapacityModalOpen(true);
        triggerSound('warning');
        return;
      }
    }

    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const newVehicle: Vehicle = {
      ...newVehicleData,
      id: `veh-${Date.now()}`,
      entryTime: timeString,
      calledTime: newVehicleData.section === 'requested' ? timeString : undefined,
      insideTime: newVehicleData.section === 'inside' ? timeString : undefined,
    };

    setVehicles((prev) => [newVehicle, ...prev]);
    triggerSound('complete');

    const typeLabel = VEHICLE_TYPE_LABELS[newVehicle.vehicleType].nameAr.split(' ')[0];
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      vehicleId: newVehicle.id,
      plateNumber: newVehicle.plateNumber,
      driverName: newVehicle.driverName,
      fromSection: 'yard',
      toSection: newVehicle.section,
      timestamp: timeString,
      actionNote: `تم تسجيل ${typeLabel} جديدة: رقم ${newVehicle.plateNumber} (${newVehicle.driverName})`,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  // Remove vehicle
  const handleRemoveVehicle = (vehicleId: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    triggerSound('click');
  };

  // Update vehicle
  const handleUpdateVehicle = (updated: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
    setSelectedVehicle(updated);
  };

  // Reset demo data
  const handleResetData = () => {
    if (confirm('هل ترغب في إعادة ضبط البيانات الافتراضية لمصنع جوتن؟')) {
      setVehicles(INITIAL_VEHICLES);
      localStorage.removeItem('jotun_dispatch_vehicles_v2');
      triggerSound('complete');
    }
  };

  // Logout handler
  const handleLogout = () => {
    setAuthUser(null);
    setIsLoginModalOpen(true);
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* 1. TOP JOTUN CORPORATE WINDOW BAR */}
      <header className="sticky top-0 z-40 bg-[#002D72] text-white border-b-2 border-[#FFA300] shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4 flex-wrap">
          {/* Right Zone (RTL): Brand title & Jotun emblem */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Jotun Penguin Badge */}
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-black shadow-xs shrink-0">
              <svg viewBox="0 0 40 40" className="w-7 h-7" fill="none">
                <circle cx="20" cy="20" r="16" fill="#FFA300" />
                <ellipse cx="20" cy="20" rx="8" ry="12" fill="#002D72" />
                <ellipse cx="20" cy="22" rx="4.5" ry="8" fill="#FFFFFF" />
                <polygon points="20,13 23,16 20,17" fill="#EF4444" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base md:text-lg font-black text-white tracking-wide">
                  مصنع جوتن للدهانات · Dispatch Yard
                </h1>
                <span className="text-[10px] font-black bg-[#FFA300] text-slate-950 px-2 py-0.5 rounded shadow-xs">
                  العاشر من رمضان
                </span>
              </div>
              <p className="text-[11px] text-blue-200 hidden sm:block">
                نظام إدارة الشاحنات (تريلا · جامبو · دبابة) بين ساحة الانتظار وعنابر التحميل
              </p>
            </div>
          </div>

          {/* Center Zone: Search Input (Digits or Driver) */}
          <div className="flex-1 max-w-md min-w-[220px]">
            <div className="relative flex items-center">
              <span className="absolute right-3 text-xs font-bold text-blue-200 pointer-events-none">
                بحث بالأرقام :
              </span>
              <input
                type="text"
                placeholder="ابحث برقم اللوحة (أرقام فقط)، اسم السائق..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-24 pl-8 py-1.5 text-xs bg-white/10 border border-white/20 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#FFA300] focus:bg-white focus:text-slate-900 transition-all text-white placeholder:text-blue-200/60 font-medium"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute left-2.5 text-white/60 hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              ) : (
                <Search className="w-3.5 h-3.5 text-blue-200 absolute left-2.5 pointer-events-none" />
              )}
            </div>
          </div>

          {/* Left Zone: Action Buttons & User Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* إضافة عربية جديدة */}
            <button
              type="button"
              onClick={() => {
                setAddModalSection('yard');
                setAddModalBay(availableBays[0] || 1);
                setIsAddModalOpen(true);
              }}
              className="px-3 py-1.5 text-xs font-black text-slate-950 bg-[#FFA300] hover:bg-amber-400 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عربية جديدة</span>
            </button>

            {/* سجل الحركة */}
            <button
              type="button"
              onClick={() => setIsLogModalOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="عرض سجل التحركات الكامل"
            >
              <History className="w-3.5 h-3.5 text-blue-200" />
              <span className="hidden sm:inline">سجل الحركات</span>
              <span className="text-[10px] bg-[#FFA300] text-slate-950 px-1.5 py-0.2 rounded-full font-mono font-bold">
                {logs.length}
              </span>
            </button>

            {/* صوت المؤثرات */}
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-1.5 rounded-xl border text-xs transition-colors cursor-pointer ${
                soundEnabled 
                  ? 'bg-white/10 text-white border-white/20' 
                  : 'bg-black/20 text-white/40 border-white/10'
              }`}
              title={soundEnabled ? 'كتم الصوت التفاعلي' : 'تفعيل المؤثرات الصوتية'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* User Profile & Logout */}
            {authUser ? (
              <div className="flex items-center gap-2 pr-2 border-r border-white/20">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-[11px] font-bold text-white truncate max-w-[140px]" title={authUser.displayName}>
                    {authUser.displayName}
                  </span>
                  <span className="text-[9px] text-[#FFA300] font-medium">
                    {authUser.role}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 text-xs font-bold text-red-200 hover:text-white bg-red-950/40 hover:bg-red-900/60 border border-red-400/30 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                  title="تسجيل خروج من النظام"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>دخول</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 2. VEHICLE TYPE QUICK FILTER & STATS BAR */}
      <section className="bg-white border-b border-slate-200 px-4 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap text-xs">
          {/* Vehicle Type Tabs (تريلا · جامبو · دبابة) */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>تصفية الفئات:</span>
            </span>

            <button
              type="button"
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                selectedTypeFilter === 'all'
                  ? 'bg-[#002D72] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              جميع الفئات ({vehicles.length})
            </button>

            <button
              type="button"
              onClick={() => setSelectedTypeFilter('trella')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTypeFilter === 'trella'
                  ? 'bg-[#002D72] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🚛 تريلا</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                {vehicles.filter((v) => v.vehicleType === 'trella').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTypeFilter('jumbo')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTypeFilter === 'jumbo'
                  ? 'bg-[#002D72] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🚚 جامبو</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                {vehicles.filter((v) => v.vehicleType === 'jumbo').length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTypeFilter('dababa')}
              className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedTypeFilter === 'dababa'
                  ? 'bg-[#002D72] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>🛻 دبابة</span>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
                {vehicles.filter((v) => v.vehicleType === 'dababa').length}
              </span>
            </button>
          </div>

          {/* Quick Yard and Inside Counters */}
          <div className="flex items-center gap-4 flex-wrap text-slate-600 font-semibold">
            <div>
              <span>خارج المصنع: </span>
              <span className="font-mono font-bold text-slate-900 text-sm">
                {yardVehicles.length} / {YARD_MAX_CAPACITY}
              </span>
            </div>
            <div>
              <span>مطلوب: </span>
              <span className="font-mono font-bold text-red-600 text-sm">
                {requestedVehicles.length}
              </span>
            </div>
            <div>
              <span>داخل المصنع: </span>
              <span className="font-mono font-bold text-emerald-700 text-sm">
                {insideVehicles.length} / 11
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowExitedDrawer(true)}
              className="text-blue-700 hover:underline font-bold"
            >
              خروج اليوم: {exitedVehicles.length}
            </button>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE / DISPATCH BOARD */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Optional Visual Guide Flow Banner */}
        <VisualGuideOverlay
          isVisible={showGuideArrows}
          onToggle={() => setShowGuideArrows(!showGuideArrows)}
        />

        {/* SECTION 1: خارج المصنع (THE YARD BAYS GRID - LINED UP VEHICLES, UP TO 99 BAYS) */}
        <YardBayGrid
          vehicles={yardVehicles}
          onMoveToSection={handleMoveToSection}
          onSelectVehicle={(veh) => {
            setSelectedVehicle(veh);
            setIsDetailModalOpen(true);
          }}
          onAddNewToBay={(bayNum) => {
            setAddModalSection('yard');
            setAddModalBay(bayNum);
            setIsAddModalOpen(true);
          }}
          activeDragId={activeDragId}
        />

        {/* SECTION 2 & 3: مطلوب (Red Outline) + داخل المصنع (Green Outline with 3 Trella, 5 Jumbo, 3 Dababa limits) */}
        <DispatchZones
          requestedVehicles={requestedVehicles}
          insideVehicles={insideVehicles}
          onMoveToSection={handleMoveToSection}
          onSelectVehicle={(veh) => {
            setSelectedVehicle(veh);
            setIsDetailModalOpen(true);
          }}
          onOpenAddModal={(defaultSec) => {
            setAddModalSection(defaultSec);
            setIsAddModalOpen(true);
          }}
          activeDragId={activeDragId}
        />
      </main>

      {/* 4. MODALS & DRAWERS */}
      {/* Login Modal with Username & Password */}
      <LoginModal
        isOpen={isLoginModalOpen || !authUser}
        onLoginSuccess={(user) => {
          setAuthUser(user);
          setIsLoginModalOpen(false);
          triggerSound('complete');
        }}
      />

      {/* Capacity Limit Alert Modal (when 3 Trella, 5 Jumbo, or 3 Dababa limit is reached) */}
      <CapacityLimitModal
        isOpen={isCapacityModalOpen}
        onClose={() => setIsCapacityModalOpen(false)}
        blockedType={capacityBlockedType}
        currentInsideCounts={currentInsideCounts}
        onExitFirstVehicle={handleExitFirstVehicleOfType}
      />

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddVehicle={handleAddVehicle}
        defaultSection={addModalSection}
        defaultBay={addModalBay}
        availableBays={availableBays}
      />

      {/* Vehicle Detail & Quick Move Modal */}
      <VehicleDetailModal
        vehicle={selectedVehicle}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedVehicle(null);
        }}
        onMoveToSection={handleMoveToSection}
        onRemoveVehicle={handleRemoveVehicle}
        onUpdateVehicle={handleUpdateVehicle}
      />

      {/* Activity / Movement Log Modal */}
      <MovementLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
      />

      {/* Exited / Dispatched Archive Drawer */}
      {showExitedDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
            <div className="flex items-center justify-between px-6 py-4 bg-[#002D72] text-white">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold">الشاحنات المكتملة (تم خروجها اليوم)</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowExitedDrawer(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-blue-200 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 flex-1">
              {exitedVehicles.length > 0 ? (
                exitedVehicles.map((veh) => (
                  <div
                    key={veh.id}
                    className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-800 flex items-center gap-2">
                        <span>{veh.driverName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-200 text-[#002D72]">
                          {VEHICLE_TYPE_LABELS[veh.vehicleType].nameAr.split(' ')[0]}
                        </span>
                      </div>
                      <div className="text-slate-600 font-mono font-bold mt-1">لوحة رقم: {veh.plateNumber}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">الحمولة: {veh.cargoType}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleMoveToSection(veh.id, 'yard');
                        setShowExitedDrawer(false);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-[#002D72] bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl cursor-pointer"
                    >
                      إعادة للساحة
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400">
                  لا توجد شاحنات مسجلة كخارجة بعد اليوم
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3 text-center text-xs text-slate-500 flex items-center justify-between flex-wrap gap-2">
        <span className="font-medium">
          شركة جوتن للدهانات · مصنع العاشر من رمضان · نظام مراقبة وتحكم حركة الساحة والشاحنات
        </span>
        <button
          type="button"
          onClick={handleResetData}
          className="text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>إعادة ضبط البيانات الافتراضية</span>
        </button>
      </footer>
    </div>
  );
}
