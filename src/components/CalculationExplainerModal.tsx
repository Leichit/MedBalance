import React from 'react';
import { Calculator, X, Calendar, AlertTriangle, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatCurrencyKzt, formatNumber } from '../utils/formatters';

interface CalculationExplainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProcurement: () => void;
}

export const CalculationExplainerModal: React.FC<CalculationExplainerModalProps> = ({
  isOpen,
  onClose,
  onCreateProcurement,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-400/30">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Demand Forecast Calculation Model</h2>
              <p className="text-[11px] text-slate-400">Section 12: Unified Mathematical Model for Defense</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Target Item Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                DEMO-M01
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Educational Demo Item (No Clinical Recommendations)</h3>
              <p className="text-[11px] text-slate-500">Astana Demo Hospital (KZ-DEMO-01)</p>
            </div>
            <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-lg">
              Unit: pack (упаковка)
            </span>
          </div>

          {/* Visual Timeline: Today ➔ Stockout ➔ Planned Delivery */}
          <div className="bg-slate-900 text-white rounded-xl p-3.5 space-y-2.5">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Dynamic Inventory Depletion Timeline</span>
              <span className="text-amber-400 font-mono">Deficit Window: Days 17.1 to 25</span>
            </div>

            <div className="relative py-4">
              {/* Baseline axis */}
              <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-1 bg-slate-700 rounded-full" />
              {/* Safe period */}
              <div className="absolute left-4 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 rounded-full" style={{ width: '45%' }} />
              {/* Critical deficit period */}
              <div className="absolute left-[45%] top-1/2 -translate-y-1/2 h-1.5 bg-red-500 rounded-full animate-pulse" style={{ width: '45%' }} />

              <div className="relative flex justify-between text-center text-[10px]">
                {/* Point 1: Today */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                    D0
                  </div>
                  <span className="font-bold text-slate-200 mt-1">Today</span>
                  <span className="text-slate-400 text-[9px]">Stock: 600</span>
                </div>

                {/* Point 2: Stockout Day 17.1 */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                    D17
                  </div>
                  <span className="font-bold text-red-400 mt-1">Stock = 0</span>
                  <span className="text-red-300 text-[9px]">Day 17.1 (Depleted)</span>
                </div>

                {/* Point 3: Planned Delivery Day 25 */}
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-[9px] shadow-sm">
                    D25
                  </div>
                  <span className="font-bold text-blue-300 mt-1">Scheduled</span>
                  <span className="text-slate-400 text-[9px]">Standard Supply</span>
                </div>
              </div>
            </div>

            {/* Red Alert Callout on Deficit Window */}
            <div className="p-2.5 bg-red-950/70 border border-red-500/50 rounded-lg text-[11px] text-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>
                <strong>Deficit Window Identified:</strong> From Day 17.1 to Day 25 (7.9 days uncovered). Hospital runs out of stock without expedited advance procurement!
              </span>
            </div>
          </div>

          {/* Mathematical Step-by-Step Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Formal Calculation Step-by-Step:
            </span>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">1. Current Stock Coverage:</span>
                  <span className="text-[11px] text-slate-500 block">Initial Inventory / Daily Consumption</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 text-sm">600 / 35 ≈ 17.1 days</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">2. Net Consumption to Day 25:</span>
                  <span className="text-[11px] text-slate-500 block">25 days × 35 packs/day = 875 packs</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900 text-sm">875 − 600 = 275 packs</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800">3. Safety Stock Buffer:</span>
                  <span className="text-[11px] text-slate-500 block">Mandatory regulatory buffer (+25 packs)</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-700 text-sm">+25 packs</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-blue-600 text-white flex items-center justify-between shadow-xs">
                <div>
                  <span className="font-bold block">4. Total Recommended Procurement:</span>
                  <span className="text-[11px] text-blue-100 block">275 net need + 25 safety stock buffer</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-base font-mono">300 packs</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
              <span>Demonstration Budget Limit:</span>
              <span className="font-bold text-slate-900">2 000 000 KZT</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 font-semibold px-3 py-1.5"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onCreateProcurement();
            }}
            className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold py-2 px-4 rounded-xl shadow-xs shadow-blue-600/20 flex items-center gap-1.5 transition-all"
          >
            <span>Create Predictive Requisition (300 packs)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
