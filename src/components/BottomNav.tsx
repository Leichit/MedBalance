import React from 'react';
import { Home, PlayCircle, Truck, Package, Cloud, Activity, User } from 'lucide-react';

export type MobileTab = 'home' | 'demo' | 'delivery' | 'warehouse' | 'system' | 'radar' | 'account';

interface BottomNavProps {
  activeTab: MobileTab;
  setActiveTab: (tab: MobileTab) => void;
  criticalCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  criticalCount,
}) => {
  return (
    <nav 
      aria-label="Main navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] max-w-md mx-auto"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* TAB 1: Home */}
        <button
          id="nav-tab-home"
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 ${
            activeTab === 'home'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Home className={`w-4 h-4 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* TAB 2: Defense Demo Walkthrough (Star Feature) */}
        <button
          id="nav-tab-demo"
          onClick={() => setActiveTab('demo')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 relative ${
            activeTab === 'demo'
              ? 'text-blue-600 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <PlayCircle className={`w-4 h-4 ${activeTab === 'demo' ? 'stroke-[2.5] text-blue-600' : 'stroke-2'}`} />
            <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Demo</span>
        </button>

        {/* TAB 3: Delivery Tracking */}
        <button
          id="nav-tab-delivery"
          onClick={() => setActiveTab('delivery')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 ${
            activeTab === 'delivery'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Truck className={`w-4 h-4 ${activeTab === 'delivery' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Delivery</span>
        </button>

        {/* TAB 4: Mobile Warehouse */}
        <button
          id="nav-tab-warehouse"
          onClick={() => setActiveTab('warehouse')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 ${
            activeTab === 'warehouse'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Package className={`w-4 h-4 ${activeTab === 'warehouse' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Warehouse</span>
        </button>

        {/* TAB 5: System Overview & Architecture */}
        <button
          id="nav-tab-system"
          onClick={() => setActiveTab('system')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-150 ${
            activeTab === 'system'
              ? 'text-blue-600 font-semibold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div className="relative">
            <Cloud className={`w-4 h-4 ${activeTab === 'system' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          </div>
          <span className="text-[10px] mt-1 tracking-tight">System</span>
        </button>
      </div>
    </nav>
  );
};
