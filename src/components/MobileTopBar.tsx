import React from 'react';
import { Plus, Bell, Activity, User, ShieldCheck } from 'lucide-react';
import { AppLogo } from './AppLogo';
import { MobileTab } from './BottomNav';

interface MobileTopBarProps {
  onOpenAddModal: () => void;
  onOpenAlerts: () => void;
  criticalCount: number;
  activeTab: MobileTab;
  setActiveTab: (tab: MobileTab) => void;
}

export const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onOpenAddModal,
  onOpenAlerts,
  criticalCount,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 py-2.5 flex items-center justify-between shadow-2xs">
      {/* Brand & Logo */}
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
        <AppLogo size="md" showText={true} />
      </div>

      {/* Quick Nav Badges & Actions */}
      <div className="flex items-center gap-1.5">
        {/* Quick Radar Link */}
        <button
          onClick={() => setActiveTab('radar')}
          className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
            activeTab === 'radar'
              ? 'bg-blue-100 text-blue-800 font-bold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Predictive Radar Table"
        >
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px]">Radar</span>
        </button>

        {/* Quick Account / Audit Link */}
        <button
          onClick={() => setActiveTab('account')}
          className={`p-1.5 rounded-lg text-xs font-semibold flex items-center transition-all ${
            activeTab === 'account'
              ? 'bg-blue-100 text-blue-800'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
          title="Logistics Account & Audit"
        >
          <User className="w-4 h-4" />
        </button>

        {/* Alerts Button with Badge */}
        <button
          id="mobile-alerts-btn"
          onClick={onOpenAlerts}
          className="relative p-1.5 rounded-lg text-slate-600 hover:text-blue-700 hover:bg-slate-100 active:scale-95 transition-all"
          title="Urgent Alerts"
          aria-label="Alerts"
        >
          <Bell className="w-4 h-4" />
          {criticalCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-3.5 min-w-3.5 px-0.5 items-center justify-center rounded-full bg-red-600 text-white text-[9px] font-extrabold shadow-xs">
              {criticalCount}
            </span>
          )}
        </button>

        {/* Add Batch / Drug Button */}
        <button
          id="mobile-add-btn"
          onClick={onOpenAddModal}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-2 py-1 rounded-lg text-xs font-semibold shadow-xs shadow-blue-600/20 transition-all"
          title="Add Batch"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="text-[11px] font-bold">Batch</span>
        </button>
      </div>
    </header>
  );
};
