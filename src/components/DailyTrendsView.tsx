import React from 'react';
import {
  Calendar,
  HardDrive,
  HeartHandshake,
  Users2,
  Watch,
  Laptop,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  TrendingUp,
} from 'lucide-react';
import { DashboardData } from '../types/dashboard';

interface DailyTrendsViewProps {
  data: DashboardData;
}

export const DailyTrendsView: React.FC<DailyTrendsViewProps> = ({ data }) => {
  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Quarterly Trend Comparison */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            📈 เปรียบเทียบผลงานรายเดือน ({data.quarter})
          </h2>
          <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
            ไตรมาส 4
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400">
                <th className="py-2.5 font-medium">เดือน / ไตรมาส</th>
                <th className="py-2.5 text-center font-medium">ยอดเครื่อง</th>
                <th className="py-2.5 text-center font-medium">7Care รวม</th>
                <th className="py-2.5 text-center font-medium">SIM + UFUND</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.monthlyComparisons.map((m) => (
                <tr key={m.month}>
                  <td className="py-3 font-semibold text-slate-800">{m.month}</td>
                  <td className="py-3 text-center font-bold text-slate-700">{m.devices} เครื่อง</td>
                  <td className="py-3 text-center font-bold text-blue-600">{m.careTotal}</td>
                  <td className="py-3 text-center font-bold text-rose-600">{m.simUfund}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold">
                <td className="py-3 px-2 text-indigo-900">รวมทั้งไตรมาส {data.quarter}</td>
                <td className="py-3 text-center text-indigo-900">101 เครื่อง</td>
                <td className="py-3 text-center text-blue-700">29</td>
                <td className="py-3 text-center text-rose-700">66</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Addon Services Tracking (SanDisk & Social Care+) */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-purple-600" />
            💾 ติดตามผลงานบริการเสริม (SanDisk & Social Care+)
          </h3>
        </div>

        <p className="text-[11px] text-slate-400">
          🎯 เกณฑ์เป้าหมาย: SanDisk ≥ 50% | Social Care+ ≥ 30% (คำนวณเทียบยอดขาย iPhone)
        </p>

        {/* Team Summary Cards */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
              <HardDrive size={14} className="text-slate-600" />
              SanDisk ทั้งทีม
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-xl font-black text-slate-800">
                {data.addonServices.sandiskTeam.percent}%
              </span>
              <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                {data.addonServices.sandiskTeam.statusText}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              จำนวน {data.addonServices.sandiskTeam.count} ชิ้น
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1">
              <HeartHandshake size={14} className="text-sky-600" />
              Social Care+ ทั้งทีม
            </span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-xl font-black text-slate-800">
                {data.addonServices.socialCareTeam.percent}%
              </span>
              <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                {data.addonServices.socialCareTeam.statusText}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              จำนวน {data.addonServices.socialCareTeam.count} ชิ้น
            </span>
          </div>
        </div>

        {/* Employee breakdown list */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-600 block">
            แยกผลงานรายบุคคล:
          </span>

          {data.addonServices.byEmployee.map((emp) => (
            <div key={emp.employeeName} className="p-3 bg-slate-50/60 rounded-2xl border border-slate-100 text-xs">
              <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                {emp.employeeName} ({emp.code})
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-500">💾 SanDisk:</span>
                  <div className="flex items-center gap-1 font-bold">
                    <span>{emp.sandiskCount} ชิ้น ({emp.sandiskPercent}%)</span>
                    <span className="text-amber-600 font-normal text-[10px]">{emp.sandiskStatusText}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-white p-2 rounded-xl border border-slate-100">
                  <span className="text-slate-500">🛡️ Social Care+:</span>
                  <div className="flex items-center gap-1 font-bold">
                    <span>{emp.socialCareCount} ชิ้น ({emp.socialCarePercent}%)</span>
                    <span className="text-rose-600 font-normal text-[10px]">{emp.socialCareStatusText}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Try On Experience */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Users2 className="w-4 h-4 text-emerald-600" />
            👥 สถิติการให้บริการ & Try On หน้าร้าน
          </h3>
        </div>

        <p className="text-[11px] text-slate-400">
          สถิติจำนวนลูกค้าที่เข้ารับบริการ และสถิติ Try On เครื่อง ({data.monthYear})
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400">
                <th className="py-2.5 font-medium">พนักงาน</th>
                <th className="py-2.5 text-center font-medium">รับลูกค้า (คน)</th>
                <th className="py-2.5 text-center font-medium">Try On Watch</th>
                <th className="py-2.5 text-center font-medium">Try On Mac</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.tryOnExperience.byEmployee.map((e) => (
                <tr key={e.name}>
                  <td className="py-2.5 font-medium text-slate-800">{e.name} ({e.code})</td>
                  <td className="py-2.5 text-center text-slate-600">{e.customers}</td>
                  <td className="py-2.5 text-center text-slate-600">{e.tryOnWatch}</td>
                  <td className="py-2.5 text-center text-slate-600">{e.tryOnMac}</td>
                </tr>
              ))}
              <tr className="font-bold bg-slate-50">
                <td className="py-2.5 px-2 text-slate-900">🏆 รวมทั้งทีมหน้าร้าน</td>
                <td className="py-2.5 text-center text-slate-900">{data.tryOnExperience.customers} คน</td>
                <td className="py-2.5 text-center text-emerald-600">{data.tryOnExperience.watchRate}%</td>
                <td className="py-2.5 text-center text-teal-600">{data.tryOnExperience.macRate}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
