import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  Building2, 
  Bell, 
  FileText, 
  CheckCircle2, 
  Database,
  Send,
  MessageSquare,
  Smartphone,
  Download,
  RefreshCw,
  Sliders,
  ChevronRight,
  Globe,
  Radio,
  Layers,
  History,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { formatCurrencyKzt } from '../utils/formatters';

export type DemoRole = 'Procurement Officer' | 'Approver' | 'Warehouse Staff' | 'Supplier';

interface AccountViewProps {
  selectedRegion: string;
  setSelectedRegion: (region: string) => void;
  onShowToast: (msg: string) => void;
  onOpenNotificationsModal: () => void;
  currentDemoRole: DemoRole;
  setCurrentDemoRole: (role: DemoRole) => void;
  onOpenOrganizationCatalog: () => void;
  performedActionsLog: { time: string; action: string; role: string; details: string }[];
  onNavigateToTab: (tab: any) => void;
}

export const AccountView: React.FC<AccountViewProps> = ({
  selectedRegion,
  setSelectedRegion,
  onShowToast,
  onOpenNotificationsModal,
  currentDemoRole,
  setCurrentDemoRole,
  onOpenOrganizationCatalog,
  performedActionsLog,
  onNavigateToTab,
}) => {
  // Notification toggles
  const [pushEnabled, setPushEnabled] = useState<boolean>(true);
  const [smsEnabled, setSmsEnabled] = useState<boolean>(true);
  const [telegramEnabled, setTelegramEnabled] = useState<boolean>(true);

  // Demo roles definition (Prompt Section 3 Specification)
  const roleDefinitions: Record<DemoRole, { titleRu: string; description: string; allowedActions: string[]; badgeColor: string }> = {
    'Procurement Officer': {
      titleRu: 'Специалист по закупкам',
      description: 'Demand forecasting, contract compliance, RFQ tender bids, requisition drafting.',
      allowedActions: [
        'Calculate demand shortfall to Day 25 (300 packs)',
        'Issue competitive quotation requests (RFQ-DEMO-021)',
        'Draft and submit purchase requests (REQ-DEMO-104)',
        'Check long-term framework contracts (CTR-DEMO-A-01)',
      ],
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    'Approver': {
      titleRu: 'Согласующее лицо / Руководитель',
      description: 'Requisition inspection, budget threshold auditing, EDS digital signing.',
      allowedActions: [
        'Review supplier comparison terms & budget ceiling',
        'Electronically sign requisitions with EDS (SHA-256)',
        'Reject or return requests for amendment',
        'Verify document hash integrity and tamper alerts',
      ],
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    },
    'Warehouse Staff': {
      titleRu: 'Кладовщик / Складской персонал',
      description: 'Mobile intake, optical Data Matrix scan, departmental dispense, inventory audits.',
      allowedActions: [
        'Perform physical intake (LOT-DEMO-104 receiving)',
        'Record under-delivery shortages in discrepancy journal',
        'Dispense medication to Intensive Care Unit (ICU)',
        'Conduct inventory cycle counts & submit variances',
      ],
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    'Supplier': {
      titleRu: 'Поставщик / Логистический оператор',
      description: 'Quotation bidding, purchase order confirmation, dispatch & transit tracking.',
      allowedActions: [
        'Submit quotation prices & delivery timeline (5,500 vs 6,000 ₸)',
        'Confirm purchase order MB-DEMO-104',
        'Dispatch shipment SHP-DEMO-104 with Demo Logistics',
        'Transmit cold-chain sensor & GPS telemetry',
      ],
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
    },
  };

  const activeRoleInfo = roleDefinitions[currentDemoRole];

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-150">
      
      {/* 1. DEMO ROLE SWITCHER (Prompt Section 3 Specification) */}
      <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Interactive Defense Switcher
            </span>
            <h2 className="text-sm font-bold text-slate-900 mt-1">Select Active Demo Role</h2>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Section 3 Protocol</span>
        </div>

        {/* 4 Role Selector Buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(['Procurement Officer', 'Approver', 'Warehouse Staff', 'Supplier'] as DemoRole[]).map((role) => {
            const isSelected = currentDemoRole === role;
            return (
              <button
                key={role}
                onClick={() => {
                  setCurrentDemoRole(role);
                  onShowToast(`Switched active demo role to "${role}"`);
                }}
                className={`p-2.5 rounded-xl border text-left font-semibold transition-all ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-700 shadow-xs' 
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold leading-tight">{role}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={`text-[10px] block mt-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                  {roleDefinitions[role].titleRu}
                </span>
              </button>
            );
          })}
        </div>

        {/* Note on Role Switching */}
        <p className="text-[11px] text-slate-500 leading-snug">
          <em>Defense Note:</em> The role switcher is provided for demonstration of multi-stakeholder workflows during midterm presentation. It is not an actual access control barrier.
        </p>
      </div>

      {/* 2. ACTIVE USER PROFILE & ORGANIZATION DETAILS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center font-extrabold text-base shadow-md shadow-blue-600/20 shrink-0">
            {currentDemoRole === 'Approver' ? 'DA' :
             currentDemoRole === 'Warehouse Staff' ? 'DW' :
             currentDemoRole === 'Supplier' ? 'DS' : 'DP'}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-sm text-slate-900 truncate">
                {currentDemoRole === 'Approver' ? 'Demo Approver (Chief Medical Officer)' :
                 currentDemoRole === 'Warehouse Staff' ? 'Demo Warehouse User (Storekeeper)' :
                 currentDemoRole === 'Supplier' ? 'Demo Supplier B Representative' : 'Demo Procurement Officer'}
              </h3>
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
            </div>
            <p className="text-xs text-blue-700 font-bold truncate mt-0.5">
              Organization: Astana Demo Hospital (KZ-DEMO-01)
            </p>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {activeRoleInfo.description}
            </p>
          </div>
        </div>

        {/* Allowed Actions for Current Role (Prompt Section 3 Specification) */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
              Permitted Actions for {currentDemoRole}:
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeRoleInfo.badgeColor}`}>
              Active Permissions
            </span>
          </div>

          <div className="space-y-1.5">
            {activeRoleInfo.allowedActions.map((action, i) => (
              <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100 text-[11px] text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{action}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Open Global Organization Directory Button */}
        <button
          onClick={onOpenOrganizationCatalog}
          className="w-full bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-800 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <Globe className="w-4 h-4 text-blue-600" />
          <span>Browse Global Healthcare Organizations Directory (Demo Data)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. REAL DEMONSTRATION AUDIT HISTORY (Prompt Section 2 Specification) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Demonstration Audit Log
            </h3>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">Immutable Log</span>
        </div>

        <p className="text-[11px] text-slate-500 leading-snug">
          Tracks actual operations performed by the user during this demonstration session:
        </p>

        <div className="space-y-2">
          {performedActionsLog.length === 0 ? (
            <div className="p-3 text-center text-slate-400 text-xs italic bg-slate-50 rounded-xl">
              No demo actions performed yet. Use the 8-Step Walkthrough to generate audit events.
            </div>
          ) : (
            performedActionsLog.map((log, index) => (
              <div key={index} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.action}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500">
                  <span className="font-semibold text-blue-600">By: {log.role}</span>
                  <span>·</span>
                  <span>{log.details}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 4. NOTIFICATION GATEWAY CHANNELS (Simulated) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Disaster & Deficit Alert Channels
            </h3>
          </div>
          <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Simulated Integration
          </span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-500" />
              <span>Push Notifications to Medical Duty Officers</span>
            </div>
            <span className="text-emerald-600 font-bold text-[11px]">Active</span>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-slate-500" />
              <span>Telegram Bot for Urgent Deficit Escapes</span>
            </div>
            <span className="text-emerald-600 font-bold text-[11px]">Active</span>
          </div>
        </div>
      </div>

    </div>
  );
};
