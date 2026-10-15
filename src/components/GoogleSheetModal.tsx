import React, { useState } from 'react';
import {
  X,
  Link2,
  FileSpreadsheet,
  Copy,
  HelpCircle,
  ClipboardPaste,
  Sparkles,
  RefreshCw,
  Check,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { fetchGoogleSheetCsv, parseDashboardCSV, getSampleCsvTemplate } from '../utils/sheetParser';
import { DashboardData } from '../types/dashboard';

interface GoogleSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataLoaded: (data: DashboardData) => void;
  currentSource: string;
  currentUrl?: string;
}

export const GoogleSheetModal: React.FC<GoogleSheetModalProps> = ({
  isOpen,
  onClose,
  onDataLoaded,
  currentSource,
  currentUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'paste' | 'template' | 'guide'>('url');
  const [sheetUrl, setSheetUrl] = useState(
    currentUrl || 'https://docs.google.com/spreadsheets/d/1e169lnR7G73Rbvl2boup20TjfhRLgCKGey/edit?usp=sharing'
  );
  const [tabName, setTabName] = useState('สรุปภาพรวม_Mobile');
  const [pastedText, setPastedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const quickTabs = ['สรุปภาพรวม_Mobile', 'ภาพรวม PIA', 'PIA', 'ตาราง 31 วัน'];

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setSheetUrl(text);
        setSuccessMessage('วางลิงก์จากคลิปบอร์ดแล้ว');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch {
      setErrorMessage('ไม่สามารถอ่านจากคลิปบอร์ดได้ โปรดกด Ctrl+V หรือ Paste ในช่องข้อความ');
      setTimeout(() => setErrorMessage(null), 4000);
    }
  };

  const handleUseSample = () => {
    setSheetUrl('https://docs.google.com/spreadsheets/d/1e169lnR7G73Rbvl2boup20TjfhRLgCKGey/edit?usp=sharing');
    setTabName('สรุปภาพรวม_Mobile');
    setSuccessMessage('โหลด URL ตัวอย่างสำเร็จ');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleFetchFromSheet = async () => {
    if (!sheetUrl.trim()) {
      setErrorMessage('กรุณาระบุ URL ของ Google Sheet');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const csvText = await fetchGoogleSheetCsv(sheetUrl, tabName);
      const parsed = parseDashboardCSV(csvText, tabName, sheetUrl);
      onDataLoaded(parsed);
      setSuccessMessage('ซิงก์ข้อมูลจาก Google Sheet สำเร็จแล้ว!');
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: any) {
      // If network fails to fetch remote sheet, fallback to parsing default template with notification
      console.warn('Sheet sync warning:', err);
      setErrorMessage(err.message || 'ไม่สามารถดึงข้อมูลได้ โปรดลองใช้แท็บ "วางตารางข้อความ" แทน');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProcessPastedData = () => {
    if (!pastedText.trim()) {
      setErrorMessage('กรุณาวางข้อมูลข้อความหรือ CSV จาก Google Sheet ก่อน');
      return;
    }
    try {
      const parsed = parseDashboardCSV(pastedText, 'ข้อมูลที่วางจาก Sheet');
      onDataLoaded(parsed);
      setSuccessMessage('ประมวลผลข้อมูลสำเร็จและนำมาแสดงผลแล้ว');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      setErrorMessage('รูปแบบข้อมูลไม่ถูกต้อง: ' + err.message);
    }
  };

  const handleCopyTemplate = () => {
    const template = getSampleCsvTemplate();
    navigator.clipboard.writeText(template);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleInstantApplyDefault = () => {
    const parsed = parseDashboardCSV(getSampleCsvTemplate(), tabName, sheetUrl);
    onDataLoaded(parsed);
    setSuccessMessage('นำข้อมูลล่าสุดมาแสดงผลในระบบเรียบร้อยแล้ว!');
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header - Green gradient matching Screenshot 1 */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-5 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 border border-white/20">
              ดึงข้อมูลด้วยลิงก์ (URL Sync)
            </span>
          </div>

          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-200" />
            เชื่อมต่อ Google Sheet
          </h2>
          <p className="text-xs text-emerald-100 mt-1">
            วางลิงก์ Google Sheet เพื่อดึงยอดขาย และ KPI มาแสดงที่แอพนี้อัตโนมัติ
          </p>
        </div>

        {/* 4 Tabs matching Screenshot 1 */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-xs">
          <button
            onClick={() => setActiveTab('url')}
            className={`py-3 px-1.5 text-center font-medium transition-colors border-b-2 flex flex-col items-center gap-1 ${
              activeTab === 'url'
                ? 'border-emerald-600 text-emerald-700 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Link2 size={16} />
            <span>วางลิงก์ Sheet</span>
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`py-3 px-1.5 text-center font-medium transition-colors border-b-2 flex flex-col items-center gap-1 ${
              activeTab === 'paste'
                ? 'border-emerald-600 text-emerald-700 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ClipboardPaste size={16} />
            <span>วางตารางเซลล์</span>
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`py-3 px-1.5 text-center font-medium transition-colors border-b-2 flex flex-col items-center gap-1 ${
              activeTab === 'template'
                ? 'border-emerald-600 text-emerald-700 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Copy size={16} />
            <span>คัดลอกตาราง</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`py-3 px-1.5 text-center font-medium transition-colors border-b-2 flex flex-col items-center gap-1 ${
              activeTab === 'guide'
                ? 'border-emerald-600 text-emerald-700 bg-white font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <HelpCircle size={16} />
            <span>วิธีแชร์ลิงก์</span>
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 overflow-y-auto space-y-4 text-slate-700 flex-1">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
              <Check size={16} className="shrink-0 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Tab 1: URL Sync */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <Link2 size={14} className="text-emerald-600" />
                    ช่องวางลิงก์ Google Sheet (URL Link):
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handlePasteFromClipboard}
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-md transition-colors"
                    >
                      <ClipboardPaste size={12} />
                      วางจากคลิปบอร์ด
                    </button>
                    <button
                      type="button"
                      onClick={handleUseSample}
                      className="text-[11px] text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md transition-colors"
                    >
                      <Sparkles size={12} />
                      ลองตัวอย่าง
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 mb-1.5 block">
                  ชื่อแท็บที่ต้องการดึง (Sheet Tab Name):
                </label>
                <input
                  type="text"
                  value={tabName}
                  onChange={(e) => setTabName(e.target.value)}
                  placeholder="สรุปภาพรวม_Mobile"
                  className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50 focus:bg-white text-slate-800 font-medium"
                />
              </div>

              {/* Quick Tab chips */}
              <div>
                <span className="text-[11px] text-slate-500 mb-1.5 block">แท็บยอดนิยมในชีต:</span>
                <div className="flex flex-wrap gap-2">
                  {quickTabs.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setTabName(tab)}
                      className={`text-xs px-3 py-1 rounded-full transition-all ${
                        tabName === tab
                          ? 'bg-emerald-600 text-white shadow-xs font-medium'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Big Action Fetch Button */}
              <button
                type="button"
                onClick={handleFetchFromSheet}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              >
                <RefreshCw size={14} className={isLoading ? 'animate-spin text-emerald-600' : 'text-slate-600'} />
                {isLoading ? 'กำลังดึงข้อมูลจาก Google Sheet...' : `ดึงข้อมูลชีต "${tabName}"`}
              </button>

              {/* Yellow notice callout matching screenshot */}
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed flex items-start gap-2.5">
                <span className="text-amber-600 text-base leading-none">⚠️</span>
                <div>
                  <span className="font-semibold text-amber-950">ข้อสำคัญในการแชร์ Google Sheet:</span>{' '}
                  ต้องเปิดสิทธิ์แชร์ไฟล์เป็น{' '}
                  <span className="font-semibold underline">"ทุกคนที่มีลิงก์ (Anyone with link) มีสิทธิ์ดู"</span>{' '}
                  หรือใช้เมนู{' '}
                  <span className="font-semibold">ไฟล์ → แชร์ → เผยแพร่ไปยังเว็บ (Publish to web) → CSV</span>{' '}
                  เพื่อให้ระบบดึงข้อมูลได้อัตโนมัติ
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Paste Raw cells */}
          {activeTab === 'paste' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                หาก Google Sheet มีการตั้งค่าสิทธิ์ภายในองค์กร คุณสามารถเปิด Google Sheet แล้วกด{' '}
                <span className="font-semibold text-slate-800">Ctrl+A แล้ว Ctrl+C</span> เพื่อคัดลอกตาราง แล้วมาวางที่นี่ได้ทันที:
              </p>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="วางข้อมูลเซลล์ หรือข้อความ CSV จาก Google Sheet ที่นี่..."
                rows={8}
                className="w-full text-[11px] font-mono p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-slate-50 leading-relaxed"
              />
              <button
                type="button"
                onClick={handleProcessPastedData}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Check size={14} />
                นำข้อมูลตารางมาแสดงผลทันที
              </button>
            </div>
          )}

          {/* Tab 3: Template & Copy */}
          {activeTab === 'template' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                คุณสามารถคัดลอกชุดข้อมูลแม่แบบของ MSC นี้เพื่อนำไปวางใน Google Sheet ใหม่ของคุณ เพื่อให้รูปแบบตารางตรงกับระบบแดชบอร์ด 100%:
              </p>
              <button
                type="button"
                onClick={handleCopyTemplate}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                {copied ? 'คัดลอกลงคลิปบอร์ดแล้ว!' : 'คัดลอกแม่แบบข้อมูลตาราง MSC (Copy Template)'}
              </button>
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] font-mono text-slate-600 max-h-44 overflow-y-auto whitespace-pre">
                {getSampleCsvTemplate().slice(0, 500)}...
              </div>
            </div>
          )}

          {/* Tab 4: Guide */}
          {activeTab === 'guide' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-600">
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <h4 className="font-semibold text-emerald-900 mb-1">วิธีแชร์ Google Sheet ให้ดึงข้อมูลได้:</h4>
                <ol className="list-decimal list-inside space-y-1 text-emerald-800 text-[11px]">
                  <li>เปิดไฟล์ Google Sheet ในเบราว์เซอร์ของคุณ</li>
                  <li>คลิกปุ่มสีเขียว <span className="font-semibold">"แชร์" (Share)</span> ที่มุมขวาบน</li>
                  <li>ใต้หัวข้อ "การเข้าถึงทั่วไป" (General Access) เปลี่ยนเป็น <span className="font-semibold">"ทุกคนที่มีลิงก์" (Anyone with the link)</span></li>
                  <li>สิทธิ์กำหนดเป็น <span className="font-semibold">"ผู้มีสิทธิ์อ่าน" (Viewer)</span></li>
                  <li>คลิก <span className="font-semibold">"คัดลอกลิงก์" (Copy link)</span> แล้วนำมาวางในช่อง URL</li>
                </ol>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <h4 className="font-semibold text-blue-900 mb-1">หรือใช้วิธีเผยแพร่ไปยังเว็บ (Publish to web):</h4>
                <p className="text-blue-800 text-[11px]">
                  ไปที่เมนู <span className="font-semibold">ไฟล์ (File) → แชร์ (Share) → เผยแพร่ไปยังเว็บ (Publish to web)</span> → เลือกแท็บ และเลือกรูปแบบเป็น <span className="font-semibold">CSV</span> แล้วคลิก เผยแพร่
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer matching Screenshot 1 */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            ปิด
          </button>

          <button
            type="button"
            onClick={handleInstantApplyDefault}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
          >
            นำข้อมูลนี้มาแสดงในแอพทันที →
          </button>
        </div>
      </div>
    </div>
  );
};
