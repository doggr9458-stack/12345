import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  User,
  Plus,
  Minus,
  RotateCcw,
  TrendingUp,
  Target,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { DashboardData } from '../types/dashboard';

interface SimulationViewProps {
  data: DashboardData;
}

export const SimulationView: React.FC<SimulationViewProps> = ({ data }) => {
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(
    data.employees[2]?.id || data.employees[0]?.id || 'jocho'
  );

  const selectedEmployee = useMemo(() => {
    return data.employees.find((e) => e.id === selectedEmployeeId) || data.employees[0];
  }, [data.employees, selectedEmployeeId]);

  // Forecast target multiplier (100%, 110%, 120%, 150%)
  const [targetMultiplier, setTargetMultiplier] = useState<number>(120);

  // Simulated additions
  const [simulatedAdditions, setSimulatedAdditions] = useState<Record<string, number>>({
    iPhone: 0,
    careIphone: 0,
    iPad: 0,
    careIpad: 0,
    mac: 0,
    careMac: 0,
    watch: 0,
    careWatch: 0,
    sim: 0,
    ufund: 0,
    film: 0,
    socialCare: 0,
    sandisk: 0,
  });

  const handleStep = (key: string, delta: number) => {
    setSimulatedAdditions((prev) => ({
      ...prev,
      [key]: Math.max(0, (prev[key] || 0) + delta),
    }));
  };

  const handleReset = () => {
    setSimulatedAdditions({
      iPhone: 0,
      careIphone: 0,
      iPad: 0,
      careIpad: 0,
      mac: 0,
      careMac: 0,
      watch: 0,
      careWatch: 0,
      sim: 0,
      ufund: 0,
      film: 0,
      socialCare: 0,
      sandisk: 0,
    });
  };

  const formatBaht = (num: number) => {
    return '฿' + Math.round(num).toLocaleString('th-TH');
  };

  // Base values for selected employee
  const baseIphone = selectedEmployee?.deviceCounts.iPhone || 28;
  const newIphone = baseIphone + (simulatedAdditions.iPhone || 0);

  const baseIpad = selectedEmployee?.deviceCounts.iPad || 1;
  const newIpad = baseIpad + (simulatedAdditions.iPad || 0);

  const baseMac = selectedEmployee?.deviceCounts.Mac || 0;
  const newMac = baseMac + (simulatedAdditions.mac || 0);

  const baseWatch = selectedEmployee?.deviceCounts.watch || 0;
  const newWatch = baseWatch + (simulatedAdditions.watch || 0);

  // Calculate new attach rates for selected employee
  // 7Care iPhone: base count
  const baseCareIphoneCount = Math.round((baseIphone * 21.4) / 100) || 6;
  const newCareIphoneCount = baseCareIphoneCount + (simulatedAdditions.careIphone || 0);
  const newCareIphonePct = newIphone > 0 ? (newCareIphoneCount / newIphone) * 100 : 0;

  // 7Care iPad
  const baseCareIpadCount = 0;
  const newCareIpadCount = baseCareIpadCount + (simulatedAdditions.careIpad || 0);
  const newCareIpadPct = newIpad > 0 ? (newCareIpadCount / newIpad) * 100 : 0;

  // SIM
  const baseSimCount = Math.round((baseIphone * 57.1) / 100) || 16;
  const newSimCount = baseSimCount + (simulatedAdditions.sim || 0);
  const newSimPct = newIphone > 0 ? (newSimCount / newIphone) * 100 : 0;

  // UFUND
  const baseUfundCount = 1;
  const newUfundCount = baseUfundCount + (simulatedAdditions.ufund || 0);
  const newUfundPct = newIphone > 0 ? (newUfundCount / newIphone) * 100 : 0;

  // Film
  const baseFilmCount = 35;
  const newFilmCount = baseFilmCount + (simulatedAdditions.film || 0);
  const newFilmPct = newIphone > 0 ? (newFilmCount / newIphone) * 100 : 0;

  // Social Care+
  const baseSocialCareCount = 0;
  const newSocialCareCount = baseSocialCareCount + (simulatedAdditions.socialCare || 0);
  const newSocialCarePct = newIphone > 0 ? (newSocialCareCount / newIphone) * 100 : 0;

  // SanDisk
  const baseSanDiskCount = 10;
  const newSanDiskCount = baseSanDiskCount + (simulatedAdditions.sandisk || 0);
  const newSanDiskPct = newIphone > 0 ? (newSanDiskCount / newIphone) * 100 : 0;

  const getPassFailBadge = (pct: number, target: number) => {
    if (pct >= target) {
      return (
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
          <CheckCircle2 size={12} />
          {pct.toFixed(1)}% ผ่าน
        </span>
      );
    }
    if (pct >= target * 0.7) {
      return (
        <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md flex items-center gap-1">
          <AlertTriangle size={12} />
          {pct.toFixed(1)}% 🤘ไปอีก
        </span>
      );
    }
    return (
      <span className="text-[11px] font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md flex items-center gap-1">
        <XCircle size={12} />
        {pct.toFixed(1)}% ไม่ผ่าน
      </span>
    );
  };

  // Team simulation totals
  const totalTeamDevices = data.appleMsc.devices + (simulatedAdditions.iPhone || 0) + (simulatedAdditions.iPad || 0) + (simulatedAdditions.mac || 0) + (simulatedAdditions.watch || 0);
  const newTeamCareIphone = 26 + (simulatedAdditions.careIphone || 0);
  const newTeamCareIphonePct = ((newTeamCareIphone / (89 + (simulatedAdditions.iPhone || 0))) * 100).toFixed(1);

  const newTeamSim = 64 + (simulatedAdditions.sim || 0);
  const newTeamSimPct = ((newTeamSim / (89 + (simulatedAdditions.iPhone || 0))) * 100).toFixed(1);

  const newTeamFilm = 90 + (simulatedAdditions.film || 0);
  const newTeamFilmPct = ((newTeamFilm / (89 + (simulatedAdditions.iPhone || 0))) * 100).toFixed(1);

  const newTeamSandisk = 32 + (simulatedAdditions.sandisk || 0);
  const newTeamSandiskPct = ((newTeamSandisk / (89 + (simulatedAdditions.iPhone || 0))) * 100).toFixed(1);

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* Simulation Header */}
      <div className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 rounded-3xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                🔮 ระบบจำลอง & คาดการณ์ยอดขาย
              </h2>
              <p className="text-xs text-purple-200">
                ลองปรับยอดขายเพื่อดูอัตราแนบและยอดที่ต้องทำเพิ่ม
              </p>
            </div>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw size={13} />
            รีเซ็ต
          </button>
        </div>

        {/* Employee Selector Pills */}
        <div className="bg-black/20 p-1.5 rounded-2xl backdrop-blur-xs flex items-center gap-1">
          <span className="text-[11px] text-purple-200 px-2 flex items-center gap-1">
            <User size={13} />
            พนักงาน:
          </span>
          {data.employees.map((emp) => (
            <button
              key={emp.id}
              onClick={() => setSelectedEmployeeId(emp.id)}
              className={`flex-1 py-1 px-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedEmployeeId === emp.id
                  ? 'bg-white text-purple-900 shadow-md font-bold'
                  : 'text-white/80 hover:bg-white/10'
              }`}
            >
              {emp.name} ({emp.code})
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Simulation Controls */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
            <Target className="w-4 h-4 text-purple-600" />
            จำลองผลงาน: {selectedEmployee?.name}
          </h3>
          <span className="text-[11px] text-slate-400">
            เกณฑ์: 7Care ≥ 40% | SIM ≥ 30% | UFUND ≥ 50%
          </span>
        </div>

        {/* Simulator rows */}
        <div className="space-y-2 pt-1">
          {/* iPhone */}
          <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">📱 iPhone (เครื่อง)</span>
              <span className="text-[11px] text-slate-400 block">ปัจจุบัน: {baseIphone} เครื่อง</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => handleStep('iPhone', -1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-indigo-700">
                  +{simulatedAdditions.iPhone}
                </span>
                <button
                  onClick={() => handleStep('iPhone', 1)}
                  className="w-7 h-7 rounded-lg bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white font-bold cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <span className="w-20 text-right font-bold text-slate-900">
                {newIphone} เครื่อง
              </span>
            </div>
          </div>

          {/* 7Care iPhone */}
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-blue-900">🛡️ 7Care iPhone (≥40%)</span>
              <span className="text-[11px] text-blue-600 block">ปัจจุบัน: {baseCareIphoneCount} ชิ้น</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border border-blue-200 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => handleStep('careIphone', -1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-blue-700">
                  +{simulatedAdditions.careIphone}
                </span>
                <button
                  onClick={() => handleStep('careIphone', 1)}
                  className="w-7 h-7 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white font-bold cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="w-24 text-right">
                {getPassFailBadge(newCareIphonePct, 40)}
              </div>
            </div>
          </div>

          {/* SIM */}
          <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-rose-900">📶 SIM True (≥30%)</span>
              <span className="text-[11px] text-rose-600 block">ปัจจุบัน: {baseSimCount} เบอร์</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border border-rose-200 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => handleStep('sim', -1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-rose-700">
                  +{simulatedAdditions.sim}
                </span>
                <button
                  onClick={() => handleStep('sim', 1)}
                  className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white font-bold cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="w-24 text-right">
                {getPassFailBadge(newSimPct, 30)}
              </div>
            </div>
          </div>

          {/* Film */}
          <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-purple-900">✨ ฟิล์ม iPhone (≥70%)</span>
              <span className="text-[11px] text-purple-600 block">ปัจจุบัน: {baseFilmCount} ชิ้น</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border border-purple-200 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => handleStep('film', -1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-purple-700">
                  +{simulatedAdditions.film}
                </span>
                <button
                  onClick={() => handleStep('film', 1)}
                  className="w-7 h-7 rounded-lg bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white font-bold cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="w-24 text-right">
                {getPassFailBadge(newFilmPct, 70)}
              </div>
            </div>
          </div>

          {/* SanDisk */}
          <div className="p-3 bg-slate-100/70 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800">💾 SanDisk (≥50%)</span>
              <span className="text-[11px] text-slate-500 block">ปัจจุบัน: {baseSanDiskCount} ชิ้น</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-2xs">
                <button
                  onClick={() => handleStep('sandisk', -1)}
                  className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-bold text-slate-700">
                  +{simulatedAdditions.sandisk}
                </span>
                <button
                  onClick={() => handleStep('sandisk', 1)}
                  className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-900 flex items-center justify-center text-white font-bold cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="w-24 text-right">
                {getPassFailBadge(newSanDiskPct, 50)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Simulation Comparison Table */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          👥 จำลองผลงานระดับทีม (Team Simulation)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400">
                <th className="py-2 font-medium">รายการทีม</th>
                <th className="py-2 text-center font-medium">ยอดเดิม</th>
                <th className="py-2 text-center font-medium">ยอดใหม่</th>
                <th className="py-2 text-right font-medium">% เดิม ➔ ใหม่</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <tr>
                <td className="py-2.5 font-semibold text-slate-800">📱 รวมขายเครื่อง (ทั้งทีม)</td>
                <td className="py-2.5 text-center text-slate-500">{data.appleMsc.devices}</td>
                <td className="py-2.5 text-center font-bold text-indigo-600">{totalTeamDevices}</td>
                <td className="py-2.5 text-right font-medium text-emerald-600">+{totalTeamDevices - data.appleMsc.devices} เครื่อง</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-800">🛡️ 7Care iPhone รวม</td>
                <td className="py-2.5 text-center text-slate-500">26</td>
                <td className="py-2.5 text-center font-bold text-blue-600">{newTeamCareIphone}</td>
                <td className="py-2.5 text-right font-bold text-slate-800">29.2% ➔ <span className="text-blue-600">{newTeamCareIphonePct}%</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-800">📶 SIM รวมทั้งทีม</td>
                <td className="py-2.5 text-center text-slate-500">64</td>
                <td className="py-2.5 text-center font-bold text-rose-600">{newTeamSim}</td>
                <td className="py-2.5 text-right font-bold text-slate-800">71.9% ➔ <span className="text-rose-600">{newTeamSimPct}%</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-800">✨ ฟิล์ม iPhone รวม</td>
                <td className="py-2.5 text-center text-slate-500">90</td>
                <td className="py-2.5 text-center font-bold text-purple-600">{newTeamFilm}</td>
                <td className="py-2.5 text-right font-bold text-slate-800">101.1% ➔ <span className="text-purple-600">{newTeamFilmPct}%</span></td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-slate-800">💾 SanDisk รวม</td>
                <td className="py-2.5 text-center text-slate-500">32</td>
                <td className="py-2.5 text-center font-bold text-slate-700">{newTeamSandisk}</td>
                <td className="py-2.5 text-right font-bold text-slate-800">36.0% ➔ <span className="text-slate-800">{newTeamSandiskPct}%</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Target Level Forecast */}
      <div className="bg-white rounded-3xl p-5 shadow-xs border border-slate-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              🎯 คาดการณ์ยอดขายตามระดับเป้าหมาย (% Target Forecast)
            </h3>
            <p className="text-[11px] text-slate-500">
              พนักงาน: <strong className="text-slate-700">{selectedEmployee?.name}</strong>
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
            {[100, 110, 120, 150].map((level) => (
              <button
                key={level}
                onClick={() => setTargetMultiplier(level)}
                className={`text-xs px-2.5 py-1 rounded-xl font-bold transition-all cursor-pointer ${
                  targetMultiplier === level
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {level}%
              </button>
            ))}
          </div>
        </div>

        {/* Calculation Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] text-slate-400">
                <th className="py-2 font-medium">สินค้า / บริการ</th>
                <th className="py-2 text-right font-medium">เป้าหมาย (บ.)</th>
                <th className="py-2 text-right font-medium">ยอดขายจริง</th>
                <th className="py-2 text-right font-medium text-rose-600">ยอดที่ต้องทำเพิ่ม ({targetMultiplier}%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {data.categories.map((cat) => {
                const adjustedTarget = cat.target * (targetMultiplier / 100);
                const empSold = cat.sold * 0.35; // proportional estimate or actual
                const needed = Math.max(0, adjustedTarget - empSold);

                return (
                  <tr key={cat.name}>
                    <td className="py-2 font-medium text-slate-800">{cat.name}</td>
                    <td className="py-2 text-right text-slate-500">{formatBaht(adjustedTarget)}</td>
                    <td className="py-2 text-right font-medium text-slate-700">{formatBaht(empSold)}</td>
                    <td className="py-2 text-right font-bold text-rose-600">{formatBaht(needed)}</td>
                  </tr>
                );
              })}
              <tr className="font-bold bg-slate-50">
                <td className="py-2.5 px-2 text-slate-900">🏆 รวมทุกสินค้า</td>
                <td className="py-2.5 text-right text-slate-700">
                  {formatBaht(data.appleMsc.target * (targetMultiplier / 100))}
                </td>
                <td className="py-2.5 text-right text-indigo-700">
                  {formatBaht(selectedEmployee?.totalSold || 1448501)}
                </td>
                <td className="py-2.5 px-2 text-right text-rose-600 text-sm">
                  {formatBaht(Math.max(0, data.appleMsc.target * (targetMultiplier / 100) - (selectedEmployee?.totalSold || 1448501)))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
