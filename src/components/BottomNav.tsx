import React from 'react';
import {
  LayoutDashboard,
  Users,
  Calculator,
  TrendingUp,
  Settings,
} from 'lucide-react';

export type NavTab = 'overview' | 'team' | 'simulation' | 'daily' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: 'overview' as NavTab,
      label: 'ภาพรวม',
      icon: LayoutDashboard,
    },
    {
      id: 'team' as NavTab,
      label: 'ทีมขาย',
      icon: Users,
    },
    {
      id: 'simulation' as NavTab,
      label: 'จำลองยอด',
      icon: Calculator,
    },
    {
      id: 'daily' as NavTab,
      label: 'รายวัน',
      icon: TrendingUp,
    },
    {
      id: 'settings' as NavTab,
      label: 'ตั้งค่า',
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around py-2 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 px-1 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-indigo-600 font-semibold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div
                className={`p-1 rounded-xl transition-all ${
                  isActive ? 'bg-indigo-50 text-indigo-600 scale-110' : ''
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
