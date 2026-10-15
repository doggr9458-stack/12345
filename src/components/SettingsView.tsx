import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Settings,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Sliders,
  Database,
  Download,
  RotateCcw,
  Check,
} from 'lucide-react';
import { DashboardData } from '../types/dashboard';

interface SettingsViewProps {
  data: DashboardData;
  onOpenSyncModal: () => void;
  onResetData: () => void;
  onUpdateTargetRule: (key: string, newTarget: number) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  data,
  onOpenSyncModal,
  onResetData,
  onUpdateTargetRule,
}) => {
  const [copiedNotification, setCopiedNotification] = useState(false);

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MSC_Sales_Data_${data.monthYear.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            ตั้งค่าระบบ & การซิงก์ข้อมูล
          </h2>
          <p className="text-xs text-slate-500">
            จัดการการเชื่อมต่อ Google Sheet และเกณฑ์ KPI สาขา
          </p>
        </div>
      </div>

      {/* Google Sheet Connection Info */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            สถานะการเชื่อมต่อ Google Sheet
          </h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
            พร้อมใช้งาน
          </span>
        </div>

        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">แหล่งข้อมูลที่เชื่อมโยง:</span>
            <strong className="text-slate-800">{data.sheetSource}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500">อัปเดตล่าสุด:</span>
            <span className="text-slate-700 font-medium">{data.lastUpdated} น.</span>
          </div>
          {data.sheetUrl && (
            <div className="pt-1 text-[11px] truncate">
              <span className="text-slate-500 block mb-0.5">URL:</span>
              <span className="text-slate-600 font-mono text-[10px] bg-white p-1.5 rounded-lg border border-slate-200 block truncate">
                {data.sheetUrl}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={onOpenSyncModal}
            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <RefreshCw size={13} />
            ตั้งค่า / เปลี่ยน Google Sheet
          </button>

          {data.sheetUrl && (
            <a
              href={data.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <ExternalLink size={13} />
              เปิดชีต
            </a>
          )}
        </div>
      </div>

      {/* KPI Target Thresholds Customization */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-indigo-600" />
          ปรับเกณฑ์เป้าหมายขั้นต่ำ (% Target Rules)
        </h3>
        <p className="text-[11px] text-slate-400">
          เกณฑ์เปอร์เซ็นต์ขั้นต่ำที่ระบบใช้ในการตัดสิน "✓ ผ่าน" หรือ "เร่งยอด"
        </p>

        <div className="space-y-2 pt-1">
          {data.overallAttachRates.map((rate) => (
            <div
              key={rate.key}
              className="p-2.5 bg-slate-50 rounded-2xl flex items-center justify-between text-xs"
            >
              <span className="font-medium text-slate-800">{rate.name}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 text-[11px]">≥</span>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={rate.targetMinPercent}
                  onChange={(e) => onUpdateTargetRule(rate.key, Number(e.target.value))}
                  className="w-14 text-center py-1 px-1 text-xs font-bold rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-slate-500 text-[11px]">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Backup & Reset */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <Database className="w-4 h-4 text-slate-600" />
          จัดการข้อมูลสำรอง (Backup & Reset)
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleExportJson}
            className="w-full sm:flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Download size={13} />
            ดาวน์โหลดสำรองข้อมูล (JSON)
          </button>

          <button
            type="button"
            onClick={onResetData}
            className="w-full sm:flex-1 py-2 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            คืนค่าเริ่มต้น (Reset Data)
          </button>
        </div>
      </div>
    </div>
  );
};
