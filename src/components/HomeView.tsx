import React from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck,
  Building2, 
  TrendingUp, 
  Truck, 
  Bell, 
  ExternalLink,
  Warehouse,
  Boxes,
  Calculator,
  Calendar,
  Layers,
  ArrowRight,
  Globe,
  FileText,
  AlertOctagon,
  Sparkles,
  Info
} from 'lucide-react';
import { DrugItem, LogisticsAlert } from '../types';
import { formatCurrencyKzt, formatNumber } from '../utils/formatters';

interface HomeViewProps {
  criticalCount: number;
  warningCount: number;
  totalDrugs: number;
  totalUnitsCount: number;
  drugs: DrugItem[];
  alerts: LogisticsAlert[];
  onUpdateAlertStatus: (alertId: string, newStatus: LogisticsAlert['status']) => void;
  onOpenNotificationsModal: () => void;
  onNavigateToRadar: (category?: string) => void;
  onOpenDrugModal: (drug: DrugItem) => void;
  onNavigateToTab: (tab: 'home' | 'demo' | 'delivery' | 'warehouse' | 'system' | 'radar' | 'account') => void;
  onOpenCalculationExplainer: () => void;
  onCreatePredictiveRequisition: () => void;
  onOpenOrganizationCatalog: () => void;
  requisitionStatus: string;
  shipmentStatus: string;
  receivingDiscrepancyCount: number;
  currentDemoRole: string;
}

export const HomeView: React.FC<HomeViewProps> = ({
  criticalCount,
  warningCount,
  totalDrugs,
  totalUnitsCount,
  drugs,
  alerts,
  onUpdateAlertStatus,
  onOpenNotificationsModal,
  onNavigateToRadar,
  onOpenDrugModal,
  onNavigateToTab,
  onOpenCalculationExplainer,
  onCreatePredictiveRequisition,
  onOpenOrganizationCatalog,
  requisitionStatus,
  shipmentStatus,
  receivingDiscrepancyCount,
  currentDemoRole,
}) => {
  // Urgent drugs for quick glance
  const urgentDrugs = drugs
    .filter((d) => d.riskLevel === 'critical' || d.riskLevel === 'warning')
    .sort((a, b) => a.burnoutDays - b.burnoutDays)
    .slice(0, 3);

  // Focus item: DEMO-M01
  const demoItem = drugs.find((d) => d.id === 'DEMO-M01') || {
    id: 'DEMO-M01',
    name: 'DEMO-M01 (Educational item - no clinical recommendations)',
    currentStock: 600,
    dailyConsumption: 35,
    burnoutDays: 17,
  };

  return (
    <div className="space-y-4 pb-2 animate-in fade-in duration-150">
      
      {/* 1. TOP CONTEXT BAR: ASTANA DEMO HOSPITAL & GLOBAL DIRECTORY BUTTON */}
      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 font-bold shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-900">Astana Demo Hospital</span>
              <span className="bg-slate-100 text-slate-600 text-[10px] font-mono px-1.5 py-0.2 rounded font-bold">
                KZ-DEMO-01
              </span>
            </div>
            <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
              <span>Active Role:</span>
              <strong className="text-blue-700">{currentDemoRole}</strong>
              <span className="text-slate-300">·</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded font-semibold">Demo Data</span>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenOrganizationCatalog}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
          title="Browse Global Organizations Directory"
        >
          <Globe className="w-4 h-4 text-blue-600" />
          <span className="hidden sm:inline text-[11px]">Global Network</span>
        </button>
      </div>

      {/* 2. 5 CORE DASHBOARD KPI CARDS (Prompt Section 4 Specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        {/* Card 1: Goods at Risk */}
        <div 
          onClick={() => onNavigateToTab('radar')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-red-300 cursor-pointer shadow-2xs transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Deficit Risk</span>
            <AlertTriangle className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="text-lg font-black text-slate-900 font-mono">
            {criticalCount + warningCount} <span className="text-[10px] font-normal text-slate-400">items</span>
          </div>
          <span className="text-[10px] text-red-600 font-bold block truncate">
            {criticalCount} critical &lt;15d
          </span>
        </div>

        {/* Card 2: Requisitions Pending Approval */}
        <div 
          onClick={() => onNavigateToTab('demo')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 cursor-pointer shadow-2xs transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Requisitions</span>
            <FileText className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-lg font-black text-slate-900 font-mono">
            1 <span className="text-[10px] font-normal text-slate-400">active</span>
          </div>
          <span className="text-[10px] text-blue-600 font-bold block truncate">
            {requisitionStatus === 'approved_signed' ? 'Approved & Signed' : 'Pending Approval'}
          </span>
        </div>

        {/* Card 3: Active Deliveries */}
        <div 
          onClick={() => onNavigateToTab('delivery')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 cursor-pointer shadow-2xs transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Deliveries</span>
            <Truck className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-lg font-black text-slate-900 font-mono">
            1 <span className="text-[10px] font-normal text-slate-400">in transit</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold block truncate">
            Demo Logistics · Day 12
          </span>
        </div>

        {/* Card 4: Receiving Discrepancies */}
        <div 
          onClick={() => onNavigateToTab('warehouse')}
          className="p-3 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 cursor-pointer shadow-2xs transition-all space-y-1"
        >
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Discrepancy</span>
            <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-lg font-black text-slate-900 font-mono">
            {receivingDiscrepancyCount} <span className="text-[10px] font-normal text-slate-400">cases</span>
          </div>
          <span className="text-[10px] text-amber-700 font-bold block truncate">
            -20 packs under-delivery
          </span>
        </div>

        {/* Card 5: Last Sync Timestamp */}
        <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Last Sync</span>
            <Clock className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <div className="text-xs font-bold text-slate-800 font-mono mt-1">
            Just now
          </div>
          <span className="text-[10px] text-slate-400 block truncate">
            ISLO & KMIS Gateway
          </span>
        </div>
      </div>

      {/* 3. FEATURED DEFICIT ITEM: DEMO-M01 WITH VISUAL TIMELINE & FORMULA BUTTON */}
      <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs space-y-3.5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                DEMO-M01
              </span>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Deficit in 17.1 days
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-1">
              DEMO-M01 (Educational item - no clinical recommendations)
            </h3>
            <p className="text-[11px] text-slate-500">Unit: pack (упаковка) · Astana Demo Hospital</p>
          </div>

          <button
            onClick={onOpenCalculationExplainer}
            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-2xs"
            title="Explain demand forecast calculation"
          >
            <Calculator className="w-3.5 h-3.5" />
            Show Calculation
          </button>
        </div>

        {/* 4 Quantitative Pillars */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Current Stock</span>
            <span className="font-extrabold text-slate-900 text-sm">600 packs</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Daily Consumption</span>
            <span className="font-extrabold text-slate-900 text-sm">35 packs/day</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Stock Depletion</span>
            <span className="font-extrabold text-red-600 text-sm">Day 17.1</span>
            <span className="text-[9px] text-slate-400 block">(600 / 35)</span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 block">Planned Delivery</span>
            <span className="font-extrabold text-slate-900 text-sm">Day 25</span>
          </div>
        </div>

        {/* Visual Timeline: Today ➔ Stock Depleted ➔ Planned Delivery */}
        <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <span>Visual Inventory Timeline</span>
            <span className="text-red-400 font-mono">Deficit Window: Days 17.1 ➔ 25</span>
          </div>

          <div className="relative py-4">
            {/* Base line */}
            <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-1 bg-slate-700 rounded-full" />
            {/* Safe covered stock period */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full" style={{ width: '48%' }} />
            {/* Deficit warning gap */}
            <div className="absolute left-[48%] top-1/2 -translate-y-1/2 h-1.5 bg-red-500 rounded-full animate-pulse" style={{ width: '42%' }} />

            <div className="relative flex justify-between text-center text-[10px]">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                  D0
                </div>
                <span className="font-bold text-slate-200 mt-1">Today</span>
                <span className="text-[9px] text-slate-400">Stock: 600</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                  D17
                </div>
                <span className="font-bold text-red-400 mt-1">Stock Exhausted</span>
                <span className="text-[9px] text-red-300">Coverage ends</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                  D25
                </div>
                <span className="font-bold text-blue-300 mt-1">Scheduled Supply</span>
                <span className="text-[9px] text-slate-400">Standard cycle</span>
              </div>
            </div>
          </div>

          <div className="p-2 rounded bg-red-950/80 border border-red-500/40 text-[11px] text-red-200 flex items-center justify-between">
            <span>
              <strong>Deficit Gap:</strong> 25 × 35 − 600 = <strong>275 packs</strong> (+25 safety stock = <strong>300 packs</strong>).
            </span>
            <span className="font-bold text-amber-300 font-mono">Limit: 2.0M ₸</span>
          </div>
        </div>

        {/* Primary Action Button: Create Predictive Procurement */}
        <button
          onClick={onCreatePredictiveRequisition}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Create Predictive Procurement Requisition (300 packs pre-filled)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4. ILLUSTRATIVE METRICS BANNER (Prompt Compliance Requirement) */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white rounded-2xl p-4 shadow-md border border-blue-700/60 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs text-blue-200 mb-2">
          <span className="font-semibold uppercase tracking-wider text-[11px] text-blue-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
            National Reserve Planning
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Illustrative metrics / Simulated data
          </span>
        </div>

        <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/15 mb-3">
          <div className="text-[11px] font-medium text-blue-200 uppercase tracking-wide">
            Averted Supply Deficit (Model)
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 font-mono">
            Prevented Deficit: 8.5B ₸
          </div>
          <div className="text-xs text-cyan-200 font-medium flex items-center gap-1 mt-0.5">
            <span>Advance procurement simulation offsetting seasonal surge</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-blue-200">
            <span className="font-medium">Emergency Reserve Fund (21.0B ₸)</span>
            <span className="font-mono text-cyan-300 font-bold">Remaining: 8.1B ₸</span>
          </div>
          <div className="w-full bg-blue-950/80 h-2 rounded-full overflow-hidden p-0.5 border border-blue-700/50">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" 
              style={{ width: '61.4%' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-blue-300 font-mono pt-0.5">
            <span>Simulated allocations: August 8.5B + November 4.4B ₸</span>
            <span>61.4%</span>
          </div>
        </div>
      </div>

    </div>
  );
};
