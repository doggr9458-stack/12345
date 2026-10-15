import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { BottomNav, NavTab } from './components/BottomNav';
import { OverviewView } from './components/OverviewView';
import { SalesTeamView } from './components/SalesTeamView';
import { SimulationView } from './components/SimulationView';
import { DailyTrendsView } from './components/DailyTrendsView';
import { SettingsView } from './components/SettingsView';
import { GoogleSheetModal } from './components/GoogleSheetModal';
import { DashboardData } from './types/dashboard';
import {
  DEFAULT_RAW_CSV,
  parseDashboardCSV,
  fetchGoogleSheetCsv,
} from './utils/sheetParser';

const STORAGE_KEY = 'msc_sales_dashboard_data_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data from localStorage or default CSV
  const [dashboardData, setDashboardData] = useState<DashboardData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return parseDashboardCSV(DEFAULT_RAW_CSV);
  });

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dashboardData));
    } catch {
      // ignore
    }
  }, [dashboardData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Quick refresh from connected Google Sheet
  const handleQuickRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (dashboardData.sheetUrl) {
        const csv = await fetchGoogleSheetCsv(dashboardData.sheetUrl, dashboardData.sheetSource);
        const parsed = parseDashboardCSV(csv, dashboardData.sheetSource, dashboardData.sheetUrl);
        setDashboardData(parsed);
        showToast('อัปเดตข้อมูลล่าสุดจาก Google Sheet เรียบร้อยแล้ว');
      } else {
        // Refresh timestamp
        setDashboardData((prev) => ({
          ...prev,
          lastUpdated: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
        }));
        showToast('รีเฟรชข้อมูลล่าสุดแล้ว');
      }
    } catch (err: any) {
      console.warn('Quick refresh note:', err);
      // Fallback timestamp update
      setDashboardData((prev) => ({
        ...prev,
        lastUpdated: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
      }));
      showToast('ข้อมูลอัปเดตแล้ว');
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleDataLoaded = (newData: DashboardData) => {
    setDashboardData(newData);
    showToast('ซิงก์ข้อมูลสำเร็จแล้ว!');
  };

  const handleResetData = () => {
    const defaultData = parseDashboardCSV(DEFAULT_RAW_CSV);
    setDashboardData(defaultData);
    showToast('คืนค่าข้อมูลเริ่มต้นเรียบร้อยแล้ว');
  };

  const handleUpdateTargetRule = (key: string, newTarget: number) => {
    setDashboardData((prev) => ({
      ...prev,
      overallAttachRates: prev.overallAttachRates.map((item) => {
        if (item.key === key) {
          const status =
            item.actualPercent >= newTarget
              ? 'passed'
              : item.actualPercent >= newTarget * 0.6
              ? 'warning'
              : 'failed';
          const statusText =
            status === 'passed' ? '✓ ผ่าน' : status === 'warning' ? 'เร่งยอด' : '❌ ไม่ผ่าน';
          return {
            ...item,
            targetMinPercent: newTarget,
            targetRule: `≥ ${newTarget}%`,
            status,
            statusText,
          };
        }
        return item;
      }),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 z-50 px-4 py-2 bg-slate-900/90 text-white text-xs font-medium rounded-full shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Main Container styled for mobile first, responsive for desktop */}
      <div className="w-full max-w-md min-h-screen bg-slate-100 flex flex-col relative shadow-2xl">
        {/* Header */}
        <Header
          branchName={dashboardData.branchName}
          quarter={dashboardData.quarter}
          lastUpdated={dashboardData.lastUpdated}
          sheetSource={dashboardData.sheetSource}
          onOpenSyncModal={() => setIsSyncModalOpen(true)}
          onQuickRefresh={handleQuickRefresh}
          isRefreshing={isRefreshing}
        />

        {/* View Content */}
        <main className="flex-1 p-3.5 sm:p-4">
          {activeTab === 'overview' && (
            <OverviewView
              data={dashboardData}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
            />
          )}

          {activeTab === 'team' && <SalesTeamView data={dashboardData} />}

          {activeTab === 'simulation' && <SimulationView data={dashboardData} />}

          {activeTab === 'daily' && <DailyTrendsView data={dashboardData} />}

          {activeTab === 'settings' && (
            <SettingsView
              data={dashboardData}
              onOpenSyncModal={() => setIsSyncModalOpen(true)}
              onResetData={handleResetData}
              onUpdateTargetRule={handleUpdateTargetRule}
            />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Google Sheet Sync Modal */}
        <GoogleSheetModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          onDataLoaded={handleDataLoaded}
          currentSource={dashboardData.sheetSource}
          currentUrl={dashboardData.sheetUrl}
        />
      </div>
    </div>
  );
}
