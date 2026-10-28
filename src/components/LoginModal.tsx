import React, { useState } from 'react';
import { Lock, User, Key, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (user: { username: string; displayName: string; role: string }) => void;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('jotun');
  const [password, setPassword] = useState('jotun123');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('يرجى إدخال اسم المستخدم وكلمة المرور');
      return;
    }

    // Accept standard or demo logins
    const displayName = username === 'admin' 
      ? 'م. إبراهيم فؤاد (مدير حركة المصنع)' 
      : 'أ. أحمد الشناوي (مشرف ديسباتش جوتن)';

    const role = username === 'admin' ? 'مدير عام الحركة' : 'مراقب ساحة التحميل';

    setError(null);
    onLoginSuccess({
      username: username.trim(),
      displayName,
      role,
    });
  };

  const handleQuickLogin = (userType: 'supervisor' | 'manager') => {
    if (userType === 'supervisor') {
      onLoginSuccess({
        username: 'jotun_dispatch',
        displayName: 'م. أحمد عبد الرحمن (مشرف ديسباتش جوتن)',
        role: 'مشرف حركة الساحات',
      });
    } else {
      onLoginSuccess({
        username: 'jotun_admin',
        displayName: 'م. إبراهيم فؤاد (مدير حركة وشحن مصنع جوتن)',
        role: 'مدير العمليات اللوجستية',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div
        dir="rtl"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Jotun Corporate Branding Banner */}
        <div className="bg-[#002D72] text-white px-6 pt-8 pb-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#FFA300]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* Jotun Penguin / Shield Emblem */}
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-lg mb-3">
            <svg viewBox="0 0 40 40" className="w-10 h-10" fill="none">
              {/* Globe / Ellipse */}
              <circle cx="20" cy="20" r="16" fill="#FFA300" />
              <path d="M4 20 Q20 8 36 20 Q20 32 4 20 Z" fill="#002D72" opacity="0.3" />
              {/* Penguin Silhouette Style */}
              <ellipse cx="20" cy="20" rx="9" ry="13" fill="#002D72" />
              <ellipse cx="20" cy="22" rx="5" ry="9" fill="#FFFFFF" />
              {/* Penguin Beak */}
              <polygon points="20,12 24,15 20,16" fill="#EF4444" />
              {/* Eyes */}
              <circle cx="18" cy="14" r="1" fill="#FFFFFF" />
            </svg>
          </div>

          <h2 className="text-xl font-black tracking-wide text-white">
            مصنع جوتن للدهانات
          </h2>
          <span className="text-xs text-amber-300 font-bold tracking-widest uppercase mt-0.5">
            JOTUN PAINTS DISPATCH SYSTEM
          </span>
          <p className="text-[11px] text-slate-200/90 mt-1 max-w-xs">
            نظام ديسباتش وإدارة حركة التريلات، الجامبو، والدبابة بساحات المصنع
          </p>
        </div>

        {/* Login Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800">
            <Lock className="w-4 h-4 text-[#002D72]" />
            <h3 className="text-sm font-bold">تسجيل الدخول للنظام</h3>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم المستخدم (Username)
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="أدخل اسم المستخدم (مثال: jotun)"
                className="w-full pr-10 pl-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#002D72] focus:bg-white text-slate-900 transition-all font-medium"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              كلمة المرور (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pr-10 pl-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#002D72] focus:bg-white text-slate-900 transition-all font-medium"
              />
              <Key className="w-4 h-4 text-slate-400 absolute right-3.5 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#002D72] hover:bg-[#001f52] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <span>دخول لوحة التحكم</span>
            <ArrowLeft className="w-4 h-4" />
          </button>

          {/* Quick Login Affordances */}
          <div className="pt-3 border-t border-slate-100">
            <span className="block text-[11px] font-bold text-slate-500 mb-2 text-center">
              أو تسجيل الدخول السريع المباشر:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('supervisor')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 text-slate-800 text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center gap-0.5"
              >
                <span className="text-[11px]">مشرف ديسباتش</span>
                <span className="text-[9px] text-slate-500">حركة وسحب الشاحنات</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('manager')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-amber-50 hover:border-amber-300 text-slate-800 text-xs font-bold transition-all text-center cursor-pointer flex flex-col items-center gap-0.5"
              >
                <span className="text-[11px]">مدير حركة المصنع</span>
                <span className="text-[9px] text-slate-500">تحكم كامل وصلاحيات</span>
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            بوابة آمنة ومحمية
          </span>
          <span>مصنع جوتن - العاشر من رمضان</span>
        </div>
      </div>
    </div>
  );
};
