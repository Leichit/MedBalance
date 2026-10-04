import React from 'react';
import { 
  Activity, 
  Truck, 
  Sparkles, 
  Sliders, 
  PlusCircle, 
  ShieldCheck,
  Building2
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'monitor' | 'logistics' | 'simulator' | 'ai';
  setActiveTab: (tab: 'monitor' | 'logistics' | 'simulator' | 'ai') => void;
  onOpenAddModal: () => void;
  criticalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  criticalCount,
}) => {
  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-30 shadow-xs">
      {/* Top Governmental / Digital Qazaqstan Ribbon */}
      <div className="bg-blue-900 text-blue-50 text-xs py-1.5 px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-800 text-blue-200 border border-blue-700">
            Digital Qazaqstan
          </span>
          <span className="hidden sm:inline text-blue-200">|</span>
          <span className="font-medium text-blue-100 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-300" />
            Ministry of Health RK & SK-Pharmacy Single Distributor
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono text-blue-200">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Mode: Predictive Analytics
          </span>
          <span className="hidden md:inline">Astana (GMT+5)</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 font-bold text-xl border border-blue-700">
              <span className="tracking-tighter">MB</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Med<span className="text-blue-600">Balance</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  v2.5 AI
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Predictive monitoring and early pharmaceutical shortage prevention
              </p>
            </div>
          </div>

          {/* Quick Action */}
          <div className="flex items-center gap-3">
            <button
              id="add-medicine-button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Consignment / Stock</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-t border-slate-100 pt-2 pb-2 overflow-x-auto scrollbar-none">
          <button
            id="tab-monitor"
            onClick={() => setActiveTab('monitor')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'monitor'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Monitoring & Deficit Detection</span>
            {criticalCount > 0 && (
              <span className="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-red-600 text-white">
                {criticalCount}
              </span>
            )}
          </button>

          <button
            id="tab-logistics"
            onClick={() => setActiveTab('logistics')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'logistics'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Logistics Hub & Retail Chains</span>
          </button>

          <button
            id="tab-simulator"
            onClick={() => setActiveTab('simulator')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'simulator'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Surge Demand Simulator</span>
          </button>

          <button
            id="tab-ai"
            onClick={() => setActiveTab('ai')}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ministry AI Advisor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
