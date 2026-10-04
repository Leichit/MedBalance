import React from 'react';
import { 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Wallet, 
  CheckCircle2, 
  Info,
  Layers
} from 'lucide-react';
import { STATS_SUMMARY } from '../data/mockData';
import { formatCurrencyKzt } from '../utils/formatters';

interface MetricsOverviewProps {
  criticalCount: number;
  warningCount: number;
  totalDrugs: number;
  totalDeficitCost: number;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  criticalCount,
  warningCount,
  totalDrugs,
  totalDeficitCost,
}) => {
  return (
    <div className="space-y-4">
      {/* Official Context Banner (Digital Qazaqstan / Ministry of Health RK) */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-xl p-4 sm:p-5 text-white shadow-md border border-blue-700">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-blue-700/80 border border-blue-500/40 text-blue-200 shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Strategic Directive • Digital Qazaqstan
                </span>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-400"></span>
                <span className="text-xs text-blue-200">Ministry of Health RK & SK-Pharmacy</span>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed max-w-4xl">
                In 2025, the Ministry of Health established a <strong className="text-white font-bold">21B ₸</strong> national emergency pharmaceutical reserve for unplanned hospital surges. 
                In August and November, healthcare facilities submitted emergency requests for <strong className="text-white font-bold">8.5B ₸</strong> and <strong className="text-white font-bold">4.4B ₸</strong> to close supply gaps. 
                The <strong className="text-blue-200 font-bold">MedBalance</strong> platform shifts Kazakhstan's healthcare logistics from reactive stocktaking to 
                <span className="underline decoration-blue-400 decoration-2 underline-offset-2 ml-1">proactive predictive forecasting</span> 15–45 days ahead of zero-inventory events.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-blue-950/60 p-3 rounded-lg border border-blue-600/40 shrink-0 self-start lg:self-center">
            <div className="text-right">
              <p className="text-[11px] font-medium text-blue-300 uppercase">2025 Reserve Utilization</p>
              <p className="text-base font-bold text-white font-mono">12.9B ₸ <span className="text-xs font-normal text-blue-300">/ 21B ₸</span></p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-blue-400 border-t-amber-400 flex items-center justify-center font-bold text-xs">
              61%
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Metric 1: Reserve Fund */}
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Ministry Reserve Fund
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-slate-900 tracking-tight font-mono">
              {formatCurrencyKzt(STATS_SUMMARY.totalReserveFundKzt)}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>Aug + Nov: <strong className="text-slate-900 font-mono">12.9B ₸</strong></span>
            <span className="text-blue-700 font-bold font-mono">Rem: 8.1B ₸</span>
          </div>
        </div>

        {/* Metric 2: Critical Deficits */}
        <div className="bg-white rounded-xl p-4 border border-red-100 shadow-xs hover:border-red-300 transition-colors">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700">
              Critical Risk (&lt;15d)
            </span>
            <div className="p-2 rounded-lg bg-red-50 text-red-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-red-600 tracking-tight font-mono">
              {criticalCount}
            </span>
            <span className="text-xs font-medium text-slate-500">
              of {totalDrugs} essential items
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 flex items-center justify-between border-t border-slate-100 pt-2">
            <span>In Warning Zone: <strong className="text-amber-700 font-mono">{warningCount}</strong></span>
            <span className="text-red-700 font-bold font-mono">Gap: {formatCurrencyKzt(totalDeficitCost)}</span>
          </div>
        </div>

        {/* Metric 3: Lead Time */}
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Warning Horizon (Lead Time)
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-blue-800 tracking-tight font-mono">
              {STATS_SUMMARY.averageWarningLeadTimeDays}d
            </span>
            <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
              +14d vs legacy standard
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 border-t border-slate-100 pt-2">
            Early signal before physical depletion in warehouses
          </div>
        </div>

        {/* Metric 4: Prevented Deficits */}
        <div className="bg-white rounded-xl p-4 border border-blue-100 shadow-xs hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between text-slate-600 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Prevented Stockouts
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-emerald-700 tracking-tight font-mono">
              {STATS_SUMMARY.preventedDeficitsCount}
            </span>
            <span className="text-xs font-medium text-slate-500">
              incidents in 2025/2026
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-600 border-t border-slate-100 pt-2 flex items-center justify-between">
            <span>Inter-regional transfers:</span>
            <strong className="text-blue-700 font-mono">18 active</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
