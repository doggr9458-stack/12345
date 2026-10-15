import React from 'react';
import { FileSpreadsheet, RefreshCw, Wifi, Battery, Sparkles } from 'lucide-react';

interface HeaderProps {
  branchName: string;
  quarter: string;
  lastUpdated: string;
  sheetSource: string;
  onOpenSyncModal: () => void;
  onQuickRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  branchName,
  quarter,
  lastUpdated,
  sheetSource,
  onOpenSyncModal,
  onQuickRefresh,
  isRefreshing,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-100/90 backdrop-blur-md border-b border-slate-200/80 px-4 py-2.5 transition-all">
      {/* Subtle Mobile Top Bar */}
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-2 px-1">
        <span className="font-semibold text-slate-700">05:47</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-tight text-slate-600">5G</span>
          <Wifi size={12} className="text-slate-600" />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] font-bold text-slate-700">84</span>
            <Battery size={14} className="text-slate-700 fill-slate-700" />
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles size={16} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">
              MSC Mobile Sales
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Live Sync</span>
              <span>•</span>
              <span className="truncate max-w-[110px] sm:max-w-none">{sheetSource}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onQuickRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
            title="รีเฟรชข้อมูล"
            aria-label="Refresh"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin text-indigo-600' : ''} />
          </button>

          <button
            type="button"
            onClick={onOpenSyncModal}
            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet size={13} />
            <span>เชื่อมต่อ Sheet</span>
          </button>
        </div>
      </div>
    </header>
  );
};
