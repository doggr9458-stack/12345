import React, { useState } from 'react';
import {
  Shield,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Signal,
  CreditCard,
  Sparkles,
  HeartHandshake,
  HardDrive,
  TrendingUp,
  Target,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Award,
  Layers,
} from 'lucide-react';
import { DashboardData, AttachRateItem } from '../types/dashboard';

interface OverviewViewProps {
  data: DashboardData;
  onOpenSyncModal: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ data, onOpenSyncModal }) => {
  const [showAllRates, setShowAllRates] = useState(false);
  const [showProductBreakdown, setShowProductBreakdown] = useState(true);

  // Format currency in Thai Baht format
  const formatBaht = (num: number) => {
    return '฿' + num.toLocaleString('th-TH');
  };

  // Helper for attach rate icons
  const renderRateIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Shield className="w-4 h-4 text-white" />;
      case 'Tablet':
        return <Tablet className="w-4 h-4 text-white" />;
      case 'Watch':
        return <Watch className="w-4 h-4 text-white" />;
      case 'Signal':
        return <Signal className="w-4 h-4 text-white" />;
      case 'CreditCard':
        return <CreditCard className="w-4 h-4 text-white" />;
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-white" />;
      case 'Laptop':
        return <Laptop className="w-4 h-4 text-white" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-4 h-4 text-white" />;
      case 'HardDrive':
        return <HardDrive className="w-4 h-4 text-white" />;
      default:
        return <Shield className="w-4 h-4 text-white" />;
    }
  };

  // Style configurations matching screenshot 2
  const getCardStyle = (item: AttachRateItem) => {
    switch (item.key) {
      case '7care_iphone':
        return {
          gradient: 'bg-gradient-to-r from-blue-600 to-blue-500',
          numberColor: 'text-blue-600',
          barColor: 'bg-blue-600',
        };
      case '7care_ipad':
        return {
          gradient: 'bg-gradient-to-r from-purple-600 to-purple-500',
          numberColor: 'text-purple-600',
          barColor: 'bg-purple-600',
        };
      case '7care_watch':
        return {
          gradient: 'bg-gradient-to-r from-emerald-600 to-teal-500',
          numberColor: 'text-emerald-600',
          barColor: 'bg-emerald-500',
        };
      case 'sim_true':
        return {
          gradient: 'bg-gradient-to-r from-red-600 to-rose-500',
          numberColor: 'text-rose-600',
          barColor: 'bg-rose-500',
        };
      case 'ufund_appin':
        return {
          gradient: 'bg-gradient-to-r from-amber-500 to-amber-600',
          numberColor: 'text-amber-600',
          barColor: 'bg-amber-500',
        };
      case 'film_iphone':
        return {
          gradient: 'bg-gradient-to-r from-indigo-600 to-purple-600',
          numberColor: 'text-indigo-600',
          barColor: 'bg-indigo-600',
        };
      case '7care_mac':
        return {
          gradient: 'bg-gradient-to-r from-teal-600 to-cyan-600',
          numberColor: 'text-teal-600',
          barColor: 'bg-teal-500',
        };
      case 'social_care':
        return {
          gradient: 'bg-gradient-to-r from-sky-600 to-blue-500',
          numberColor: 'text-sky-600',
          barColor: 'bg-sky-500',
        };
      case 'sandisk':
        return {
          gradient: 'bg-gradient-to-r from-slate-700 to-slate-800',
          numberColor: 'text-slate-700',
          barColor: 'bg-slate-700',
        };
      default:
        return {
          gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600',
          numberColor: 'text-blue-600',
          barColor: 'bg-blue-600',
        };
    }
  };

  const getStatusBadge = (status: 'passed' | 'warning' | 'failed', text: string) => {
    if (status === 'passed' || text.includes('ผ่าน')) {
      return (
        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          ✓ ผ่าน
        </span>
      );
    }
    if (status === 'warning' || text.includes('ไปอีก') || text.includes('เร่งยอด')) {
      return (
        <span className="inline-flex items-center text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
          เร่งยอด
        </span>
      );
    }
    return (
      <span className="inline-flex items-center text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
        ❌ ไม่ผ่าน
      </span>
    );
  };

  const displayedRates = showAllRates
    ? data.overallAttachRates
    : data.overallAttachRates.slice(0, 6);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* KPI Top Hero Header matching Screenshot 2 */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xs">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">
              สรุป % Att ภาพรวม
            </h2>
          </div>
          <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
            บริการแนบ & KPI
          </span>
        </div>

        <p className="text-xs text-slate-500 font-medium">
          อัตราการแนบบริการสำคัญประจำสาขาเทียบกับเกณฑ์เป้าหมายขั้นต่ำ
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          เป้าหมายแนบขั้นต่ำประจำไตรมาส {data.quarter}
        </p>
      </div>

      {/* 2-Column Grid of KPI Cards matching Screenshot 2 */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {displayedRates.map((item) => {
          const style = getCardStyle(item);
          const percent = item.actualPercent;
          const cappedPercent = Math.min(100, Math.max(0, percent));

          return (
            <div
              key={item.key}
              className="bg-white rounded-3xl shadow-xs border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Card top banner with rounded title */}
              <div className={`${style.gradient} px-3.5 py-2.5 flex items-center gap-1.5 text-white`}>
                <div className="p-0.5 rounded-md bg-white/10 backdrop-blur-xs">
                  {renderRateIcon(item.icon)}
                </div>
                <span className="text-xs font-semibold tracking-wide truncate">
                  {item.name}
                </span>
              </div>

              {/* Big Percentage Number */}
              <div className="px-4 pt-4 pb-3 text-center">
                <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${style.numberColor}`}>
                  {percent % 1 === 0 ? `${percent}%` : `${percent.toFixed(2)}%`}
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${style.barColor}`}
                    style={{ width: `${cappedPercent}%` }}
                  />
                </div>
              </div>

              {/* Card footer: Target & Status */}
              <div className="px-3.5 py-2.5 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-medium">
                  เป้า {item.targetRule}
                </span>
                {getStatusBadge(item.status, item.statusText)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more/less attach rates toggle */}
      {data.overallAttachRates.length > 6 && (
        <div className="text-center">
          <button
            onClick={() => setShowAllRates(!showAllRates)}
            className="text-xs text-slate-500 hover:text-slate-800 font-medium inline-flex items-center gap-1 py-1.5 px-3 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
          >
            {showAllRates ? (
              <>
                <ChevronUp size={14} />
                ซ่อนบริการเสริมเพิ่มเติม
              </>
            ) : (
              <>
                <ChevronDown size={14} />
                ดูบริการเสริมทั้งหมด ({data.overallAttachRates.length} รายการ)
              </>
            )}
          </button>
        </div>
      )}

      {/* Apple MSC Main Target Card */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-900 to-slate-800 flex items-center justify-center text-white shadow-sm">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                ยอดขายรวม Apple MSC ({data.monthYear})
              </h3>
              <p className="text-[11px] text-slate-500">
                เป้าหมายสาขา • ขายไปแล้ว {data.appleMsc.devices} เครื่อง
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
              บรรลุ {data.appleMsc.achievePercent}%
            </span>
          </div>
        </div>

        {/* Amount Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">
              เป้าหมาย: <strong className="text-slate-800">{formatBaht(data.appleMsc.target)}</strong>
            </span>
            <span className="text-indigo-600 font-bold">
              {formatBaht(data.appleMsc.sold)}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, data.appleMsc.achievePercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
            <span>ห่างจากเป้า: <strong className="text-rose-600">{formatBaht(data.appleMsc.gap)}</strong></span>
            <span>คาดการณ์: <strong className="text-emerald-600">{formatBaht(data.appleMsc.forecastAmount)} ({data.appleMsc.forecastPercent}%)</strong></span>
          </div>
        </div>

        {/* Summary Badges Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-slate-500 block">ยอดขายจริง</span>
            <span className="text-xs font-bold text-slate-800">{formatBaht(data.appleMsc.sold)}</span>
          </div>
          <div className="bg-slate-50 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-slate-500 block">จำนวนเครื่อง</span>
            <span className="text-xs font-bold text-slate-800">{data.appleMsc.devices} เครื่อง</span>
          </div>
          <div className="bg-slate-50 rounded-2xl p-2.5 text-center">
            <span className="text-[10px] text-slate-500 block">Forecast สิ้นเดือน</span>
            <span className="text-xs font-bold text-emerald-600">{data.appleMsc.forecastPercent}%</span>
          </div>
        </div>
      </div>

      {/* Category Sales Breakdown */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
            <Layers className="w-4 h-4 text-indigo-500" />
            เป้าหมาย & ยอดขายแยกตามประเภทสินค้า
          </h3>
          <button
            onClick={() => setShowProductBreakdown(!showProductBreakdown)}
            className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {showProductBreakdown ? 'ย่อ' : 'ขยาย'}
          </button>
        </div>

        {showProductBreakdown && (
          <div className="space-y-3 pt-1">
            {data.categories.map((cat) => (
              <div key={cat.name} className="p-3 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    {cat.name.includes('iPhone') && <Smartphone className="w-3.5 h-3.5 text-blue-500" />}
                    {cat.name.includes('iPad') && <Tablet className="w-3.5 h-3.5 text-purple-500" />}
                    {cat.name.includes('Mac') && <Laptop className="w-3.5 h-3.5 text-teal-500" />}
                    {cat.name.includes('Watch') && <Watch className="w-3.5 h-3.5 text-emerald-500" />}
                    {cat.name.includes('BTB') && <ShoppingBag className="w-3.5 h-3.5 text-amber-500" />}
                    {cat.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500">{cat.devices} {cat.unit}</span>
                    <span className="font-bold text-slate-800">{formatBaht(cat.sold)}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                      cat.achievePercent >= 100 ? 'bg-emerald-100 text-emerald-700' :
                      cat.achievePercent >= 40 ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {cat.achievePercent}%
                    </span>
                  </div>
                </div>

                {/* Mini progress bar */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      cat.name.includes('iPhone') ? 'bg-blue-600' :
                      cat.name.includes('iPad') ? 'bg-purple-600' :
                      cat.name.includes('Mac') ? 'bg-teal-600' :
                      cat.name.includes('Watch') ? 'bg-emerald-600' : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, cat.achievePercent)}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>เป้า: {formatBaht(cat.target)}</span>
                  <span>ขาด: {formatBaht(cat.gap)}</span>
                  <span>Forecast: {cat.forecastPercent}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer reference matching Screenshot 2 */}
      <div className="text-center pt-2 pb-4 space-y-2">
        <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
          <span>MSC Mobile Sales Dashboard</span>
          <span>•</span>
          <span>อ้างอิงข้อมูลจากชีต <strong className="text-slate-700">{data.sheetSource}</strong></span>
        </div>

        {data.sheetUrl && (
          <div className="flex items-center justify-center gap-2">
            <a
              href={data.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline cursor-pointer"
            >
              เปิดชีตต้นฉบับ
              <ExternalLink size={12} />
            </a>
            <span className="text-slate-300">|</span>
            <button
              onClick={onOpenSyncModal}
              className="text-xs text-emerald-600 hover:text-emerald-800 font-medium hover:underline cursor-pointer"
            >
              เปลี่ยนชีต / อัปเดตข้อมูล
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
