import React from 'react';
import { 
  FileText, 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Ban, 
  CheckCircle2, 
  Building2, 
  Layers,
  ArrowRight
} from 'lucide-react';
import { DirectContract } from '../data/demoScenarioData';
import { formatCurrencyKzt, formatNumber } from '../utils/formatters';

interface DirectContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  contract: DirectContract;
  onShowToast: (msg: string) => void;
}

export const DirectContractModal: React.FC<DirectContractModalProps> = ({
  isOpen,
  onClose,
  contract,
  onShowToast,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-400/30">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Direct Procurement Contract</h2>
              <p className="text-[11px] text-slate-400">{contract.contractId}</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-700">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] text-slate-400 block">Designated Supplier:</span>
              <span className="font-bold text-slate-900 text-sm">{contract.supplierName}</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full text-[10px]">
              {contract.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Item Code:</span>
              <span className="font-bold text-slate-800">{contract.itemCode}</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Contracted Fixed Rate:</span>
              <span className="font-bold text-slate-800">{formatCurrencyKzt(contract.pricePerPackKzt)} / pack</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-400 block text-[10px]">Total Quota:</span>
              <span className="font-bold text-slate-800">{formatNumber(contract.totalAllocatedLimit)} packs</span>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
              <span className="text-blue-600 block text-[10px] font-semibold">Remaining Limit:</span>
              <span className="font-extrabold text-blue-900">{formatNumber(contract.remainingVolumeLimit)} packs</span>
            </div>
          </div>

          {/* Strict Procurement Governance Rules (Prompt Section 12 Specification) */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 space-y-2 text-amber-900">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <Ban className="w-4 h-4 text-amber-700 shrink-0" />
              Procurement Integrity Rules (Section 12):
            </div>
            <ul className="list-disc list-inside text-[11px] space-y-1">
              <li>
                <strong>Supplier Exclusivity:</strong> Under contract {contract.contractId}, <em>Demo Supplier B cannot be selected</em>.
              </li>
              <li>
                <strong>Dual-Path Prohibition:</strong> It is forbidden to process the same requisition simultaneously along both routes (Direct Contract vs. Competitive RFQ).
              </li>
              <li>
                In our primary demo scenario, selection occurs inside the authorized competitive RFQ (RFQ-DEMO-021).
              </li>
            </ul>
          </div>

          {/* Test Action Check */}
          <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Simulate Procurement Rule Enforcement:
            </span>
            <button
              onClick={() => {
                onShowToast('Compliance Check: Supplier B blocked from Contract CTR-DEMO-A-01. Route strictly limited to Supplier A.');
              }}
              className="w-full bg-slate-800 hover:bg-slate-900 active:scale-95 text-white py-2 px-3 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verify Contract Restriction Policy
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold py-1.5 px-4 rounded-xl transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
