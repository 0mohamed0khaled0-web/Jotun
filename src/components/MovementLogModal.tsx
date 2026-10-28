import React from 'react';
import { ActivityLog } from '../types/dispatch';
import { X, History, FileText, ArrowRight, Trash } from 'lucide-react';

interface MovementLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
  onClearLogs: () => void;
}

export const MovementLogModal: React.FC<MovementLogModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  if (!isOpen) return null;

  const sectionNameMap = {
    yard: 'خارج المصنع (ساحة)',
    requested: 'مطلوب (استدعاء)',
    inside: 'داخل المصنع (تحميل)',
    exited: 'تم الخروج',
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        dir="rtl"
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#002D72] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-[#FFA300]">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">سجل حركات شاحنات مصنع جوتن (Dispatch Log)</h3>
              <p className="text-xs text-blue-200">سجل زمني لعمليات النقل بالسحب والإفلات والضغط</p>
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

        {/* Action strip */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700">إجمالي الحركات المسجلة: {logs.length}</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center gap-1 cursor-pointer font-bold"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>طباعة التقرير</span>
            </button>
            {logs.length > 0 && (
              <button
                type="button"
                onClick={onClearLogs}
                className="px-3 py-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-1 cursor-pointer font-bold"
              >
                <Trash className="w-3.5 h-3.5" />
                <span>تفريغ السجل</span>
              </button>
            )}
          </div>
        </div>

        {/* List of Logs */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {logs.length > 0 ? (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-[#002D72]/40 transition-all flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-[#002D72] flex items-center justify-center shrink-0 font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{log.driverName}</span>
                      <span className="text-[11px] font-mono text-[#002D72] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 font-bold">
                        لوحة: {log.plateNumber}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1 flex items-center gap-1">
                      <span>{sectionNameMap[log.fromSection]}</span>
                      <ArrowRight className="w-3 h-3 text-slate-400 rotate-180" />
                      <span className="font-bold text-slate-800">{sectionNameMap[log.toSection]}</span>
                    </div>
                  </div>
                </div>

                <div className="text-left shrink-0 font-mono text-slate-400 text-[11px]">
                  {log.timestamp}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400">
              <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>لم يتم تسجيل أي حركة بعد. اسحب سيارة من قسم لقسم لرؤية السجل هنا.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
