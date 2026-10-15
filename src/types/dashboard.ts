export interface SalesCategory {
  name: string;
  target: number;
  sold: number;
  devices: number;
  unit: string;
  gap: number;
  achievePercent: number;
  forecastAmount: number;
  forecastPercent: number;
}

export interface AttachRateItem {
  key: string;
  name: string;
  targetRule: string; // e.g. "≥40%"
  targetMinPercent: number;
  actualPercent: number;
  count: number;
  status: 'passed' | 'warning' | 'failed';
  statusText: string; // "✓ ผ่าน", "เร่งยอด" / "🤘ไปอีก", "❌ ไม่ผ่าน"
  colorTheme: 'blue' | 'purple' | 'green' | 'crimson' | 'amber' | 'violet' | 'teal' | 'slate';
  icon: string;
}

export interface EmployeeProductSale {
  name: string;
  target: number;
  sold: number;
  achievePercent: number;
  gap: number;
  status: string;
  color: string;
}

export interface EmployeeAttachRate {
  name: string;
  rule: string;
  percent: number;
  statusText: string;
  status: 'passed' | 'warning' | 'failed';
}

export interface Employee {
  id: string;
  name: string;
  code: string;
  avatarText: string;
  totalDevices: number;
  totalTarget: number;
  totalSold: number;
  achievePercent: number;
  gap: number;
  colorTheme: 'blue' | 'orange' | 'emerald' | 'purple';
  products: EmployeeProductSale[];
  attachRates: EmployeeAttachRate[];
  deviceCounts: {
    iPhone: number;
    iPad: number;
    Mac: number;
    watch: number;
  };
}

export interface MonthlyComparison {
  month: string;
  devices: number;
  careTotal: number;
  simUfund: number;
}

export interface TryOnStat {
  name: string;
  code: string;
  customers: number;
  tryOnWatch: number;
  tryOnMac: number;
}

export interface AddonServiceStat {
  name: string;
  service: 'SanDisk' | 'Social Care+';
  count: number;
  attachPercent: number;
  status: 'passed' | 'warning' | 'failed';
  statusText: string;
}

export interface DashboardData {
  branchName: string;
  quarter: string;
  monthYear: string;
  sheetSource: string;
  sheetUrl?: string;
  lastUpdated: string;
  appleMsc: SalesCategory;
  categories: SalesCategory[];
  overallAttachRates: AttachRateItem[];
  employees: Employee[];
  monthlyComparisons: MonthlyComparison[];
  addonServices: {
    sandiskTeam: { count: number; percent: number; statusText: string };
    socialCareTeam: { count: number; percent: number; statusText: string };
    byEmployee: {
      employeeName: string;
      code: string;
      sandiskCount: number;
      sandiskPercent: number;
      sandiskStatusText: string;
      socialCareCount: number;
      socialCarePercent: number;
      socialCareStatusText: string;
    }[];
  };
  tryOnExperience: {
    customers: number;
    watchRate: number;
    macRate: number;
    byEmployee: TryOnStat[];
  };
}
