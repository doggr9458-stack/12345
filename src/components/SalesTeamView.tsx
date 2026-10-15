import React, { useState } from 'react';
import {
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Users,
  Shield,
  Coins,
  Sparkles,
  Search,
} from 'lucide-react';
import { DashboardData, Employee } from '../types/dashboard';

interface SalesTeamViewProps {
  data: DashboardData;
}

export const SalesTeamView: React.FC<SalesTeamViewProps> = ({ data }) => {
  // Toggle per employee or global
  const [activeTabByEmployee, setActiveTabByEmployee] = useState<Record<string, 'sales' | 'attach'>>({
    yo: 'sales',
    kim: 'sales',
    jocho: 'sales',
  });

  const [searchQuery, setSearchQuery] = useState('');

  const toggleTab = (empId: string, tab: 'sales' | 'attach') => {
    setActiveTabByEmployee((prev) => ({
      ...prev,
      [empId]: tab,
    }));
  };

  const formatBaht = (num: number) => {
    return '฿' + num.toLocaleString('th-TH');
  };

  const getGradientHeader = (theme: Employee['colorTheme']) => {
    switch (theme) {
      case 'blue':
        return 'bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-600';
      case 'orange':
        return 'bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500';
      case 'emerald':
        return 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600';
      case 'purple':
        return 'bg-gradient-to-r from-purple-700 via-pink-600 to-rose-500';
      default:
        return 'bg-gradient-to-r from-slate-700 via-indigo-700 to-slate-800';
    }
  };

  const filteredEmployees = data.employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.includes(searchQuery)
  );

  return (
    <div className="space-y-5 pb-20 animate-in fade-in duration-200">
      {/* Top Team Header Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xs border border-slate-100 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" />
            ผลงานรายบุคคล ({data.monthYear})
          </h2>
          <p className="text-xs text-slate-500">
            พนักงาน {data.employees.length} ท่าน • เกณฑ์เป้าหมายขั้นต่ำประจำไตรมาส {data.quarter}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-28 sm:w-40">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อ/รหัส..."
            className="w-full text-xs pl-8 pr-2 py-1.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Employees Cards List */}
      <div className="space-y-4">
        {filteredEmployees.map((emp) => {
          const currentTab = activeTabByEmployee[emp.id] || 'sales';
          const headerGradient = getGradientHeader(emp.colorTheme);

          return (
            <div
              key={emp.id}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden"
            >
              {/* Header Banner matching Screenshot 3 */}
              <div className={`${headerGradient} p-4 sm:p-5 text-white relative`}>
                <div className="flex items-center justify-between mb-4">
                  {/* Left: Avatar & Name */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-base border border-white/30 text-white shadow-xs">
                      {emp.avatarText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold tracking-tight">{emp.name}</span>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-mono text-white/90">
                          {emp.code}
                        </span>
                      </div>
                      <p className="text-xs text-white/80 mt-0.5">
                        อุปกรณ์ทั้งหมด: {emp.totalDevices} เครื่อง
                      </p>
                    </div>
                  </div>

                  {/* Right: Circular Progress Ring matching Screenshot 3 */}
                  <div className="flex flex-col items-center">
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-14 h-14 -rotate-90">
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-white/20"
                          fill="transparent"
                        />
                        <circle
                          cx="28"
                          cy="28"
                          r="22"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="text-white drop-shadow-xs"
                          fill="transparent"
                          strokeDasharray={138.2}
                          strokeDashoffset={138.2 - (138.2 * Math.min(100, emp.achievePercent)) / 100}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-xs font-bold text-white">
                        {Math.round(emp.achievePercent)}%
                      </span>
                    </div>
                    <span className="text-[10px] text-white/90 mt-0.5 font-medium">
                      เป้ารวม {emp.achievePercent}%
                    </span>
                  </div>
                </div>

                {/* Segmented Control Toggle matching Screenshot 3 */}
                <div className="bg-black/20 p-1 rounded-2xl flex gap-1 backdrop-blur-xs">
                  <button
                    type="button"
                    onClick={() => toggleTab(emp.id, 'sales')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      currentTab === 'sales'
                        ? 'bg-white text-slate-900 shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>💰</span>
                    <span>ยอดขายจริง</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleTab(emp.id, 'attach')}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      currentTab === 'attach'
                        ? 'bg-white text-slate-900 shadow-md'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span>🛡️</span>
                    <span>Attach Rates</span>
                  </button>
                </div>
              </div>

              {/* Body Content based on active tab */}
              <div className="p-4 sm:p-5 space-y-4">
                {currentTab === 'sales' ? (
                  <>
                    {/* Overall Target Bar */}
                    <div className="space-y-1.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">
                          เป้า: <strong className="text-slate-800">{formatBaht(emp.totalTarget)}</strong>
                        </span>
                        <span className="text-indigo-600 font-bold text-sm">
                          {formatBaht(emp.totalSold)}
                        </span>
                      </div>

                      {/* Main Progress Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, emp.achievePercent)}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                        <span className="text-rose-600">ขาด {formatBaht(emp.gap)}</span>
                        <span className="text-slate-600 font-semibold">{emp.achievePercent}%</span>
                      </div>
                    </div>

                    {/* Section Title with blue pill icon matching Screenshot 3 */}
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-1.5 h-4 bg-blue-600 rounded-full" />
                      <h4 className="text-xs font-bold text-slate-800 tracking-wide">
                        เป้าหมายยอดขายแยกรายสินค้า
                      </h4>
                    </div>

                    {/* Product Breakdown List matching Screenshot 3 */}
                    <div className="space-y-2.5">
                      {emp.products.map((prod) => (
                        <div
                          key={prod.name}
                          className="p-3 bg-white border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors shadow-2xs"
                        >
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                              {prod.name.includes('iPhone') && <Smartphone className="w-3.5 h-3.5 text-blue-500" />}
                              {prod.name.includes('iPad') && <Tablet className="w-3.5 h-3.5 text-purple-500" />}
                              {prod.name.includes('Mac') && <Laptop className="w-3.5 h-3.5 text-teal-500" />}
                              {prod.name.includes('Watch') && <Watch className="w-3.5 h-3.5 text-emerald-500" />}
                              {prod.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800">
                                {formatBaht(prod.sold)}
                              </span>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                                  prod.achievePercent >= 50
                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                                    : prod.achievePercent > 0
                                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                                }`}
                              >
                                {prod.achievePercent}%
                              </span>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden my-1.5">
                            <div
                              className={`h-full rounded-full ${
                                prod.name.includes('iPhone')
                                  ? 'bg-blue-600'
                                  : prod.name.includes('iPad')
                                  ? 'bg-purple-600'
                                  : prod.name.includes('Mac')
                                  ? 'bg-teal-600'
                                  : 'bg-slate-400'
                              }`}
                              style={{ width: `${Math.min(100, prod.achievePercent)}%` }}
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                            <span>เป้า: {formatBaht(prod.target)}</span>
                            <span className="text-rose-500">ขาด: {formatBaht(prod.gap)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* Attach Rates Tab */
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-medium pb-1">
                      <span>บริการแนบ & เกณฑ์ขั้นต่ำ</span>
                      <span>อัตราที่ทำได้จริง</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {emp.attachRates.map((rate, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-slate-800 block">
                              {rate.name}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              เกณฑ์: {rate.rule}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm">
                              {rate.percent > 0 ? `${rate.percent}%` : '-'}
                            </span>
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-md font-semibold whitespace-nowrap ${
                                rate.status === 'passed'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : rate.status === 'warning'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {rate.statusText}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Device units counter */}
                    <div className="mt-3 p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100 flex items-center justify-around text-center text-xs text-indigo-900">
                      <div>
                        <span className="text-[10px] text-indigo-600 block">iPhone</span>
                        <strong className="text-sm">{emp.deviceCounts.iPhone}</strong> เครื่อง
                      </div>
                      <div className="border-r border-indigo-200 h-6" />
                      <div>
                        <span className="text-[10px] text-indigo-600 block">iPad</span>
                        <strong className="text-sm">{emp.deviceCounts.iPad}</strong> เครื่อง
                      </div>
                      <div className="border-r border-indigo-200 h-6" />
                      <div>
                        <span className="text-[10px] text-indigo-600 block">Mac</span>
                        <strong className="text-sm">{emp.deviceCounts.Mac}</strong> เครื่อง
                      </div>
                      <div className="border-r border-indigo-200 h-6" />
                      <div>
                        <span className="text-[10px] text-indigo-600 block">Watch</span>
                        <strong className="text-sm">{emp.deviceCounts.watch}</strong> เครื่อง
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
