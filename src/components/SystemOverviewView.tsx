import React, { useState } from 'react';
import { 
  Cloud, 
  Server, 
  Database, 
  Smartphone, 
  Globe, 
  Lock, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Layers, 
  Truck, 
  ArrowRight, 
  Info,
  Clock,
  Radio,
  FileCheck2
} from 'lucide-react';
import { formatNumber } from '../utils/formatters';

interface SystemOverviewViewProps {
  onShowToast: (msg: string) => void;
}

export const SystemOverviewView: React.FC<SystemOverviewViewProps> = ({ onShowToast }) => {
  // Offline Simulation State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [offlinePendingQueue, setOfflinePendingQueue] = useState<
    { id: string; operation: string; timestamp: string; qty: number; status: 'pending_sync' | 'synced' }[]
  >([]);
  const [simulatedStock, setSimulatedStock] = useState<number>(460);
  const [lastSyncResult, setLastSyncResult] = useState<string | null>(null);

  // Data flow highlights
  const [selectedFlow, setSelectedFlow] = useState<number | null>(null);

  const dataFlows = [
    {
      id: 1,
      title: 'Requisitions & Approver Decisions',
      titleRu: 'Заявки и решения согласующих',
      desc: 'Creation of REQ-DEMO-104, budget verification, electronic signing, approvals.',
      icon: FileText,
      color: 'text-blue-500 border-blue-400 bg-blue-50',
    },
    {
      id: 2,
      title: 'Stock Balances & Warehouse Operations',
      titleRu: 'Остатки и складские операции',
      desc: 'Intake reception, physical count updates, ward dispense, cycle counts.',
      icon: Layers,
      color: 'text-emerald-500 border-emerald-400 bg-emerald-50',
    },
    {
      id: 3,
      title: 'Supplier Quotes & Confirmations',
      titleRu: 'Предложения и подтверждения поставщиков',
      desc: 'RFQ-DEMO-021 bidding, availability check (shortage alert), PO dispatch MB-DEMO-104.',
      icon: Server,
      color: 'text-amber-500 border-amber-400 bg-amber-50',
    },
    {
      id: 4,
      title: 'Delivery Statuses & Logistics',
      titleRu: 'Статусы доставки',
      desc: 'SHP-DEMO-104 telemetry, cold-chain monitoring, GPS corridor, arrival notice.',
      icon: Truck,
      color: 'text-indigo-500 border-indigo-400 bg-indigo-50',
    },
    {
      id: 5,
      title: 'Documents & Verification Results',
      titleRu: 'Документы и результаты проверки',
      desc: 'SHA-256 hash digests, tamper audit logs, RFID gate incident journals.',
      icon: FileCheck2,
      color: 'text-purple-500 border-purple-400 bg-purple-50',
    },
  ];

  // Perform an offline stock operation
  const handlePerformOfflineOperation = () => {
    const newOp = {
      id: `op-${Date.now()}`,
      operation: 'Warehouse Intake: +20 packs buffer (DEMO-M01)',
      timestamp: new Date().toLocaleTimeString(),
      qty: 20,
      status: 'pending_sync' as const,
    };

    setOfflinePendingQueue((prev) => [newOp, ...prev]);

    if (!isOnline) {
      onShowToast('Action recorded offline as "Pending sync". Total stock remains 460 packs until server confirmation.');
    } else {
      // If online, immediately reconcile
      setSimulatedStock((prev) => prev + 20);
      setLastSyncResult('Immediate online reconciliation confirmed by MedBalance application service.');
      onShowToast('Online operation synchronized and confirmed by server.');
    }
  };

  // Reconnect and synchronize
  const handleReconnectAndSync = () => {
    setIsOnline(true);

    const pendingCount = offlinePendingQueue.filter((o) => o.status === 'pending_sync').length;

    if (pendingCount === 0) {
      setLastSyncResult('Idempotent check: All records are already synchronized. Zero duplicate operations applied.');
      onShowToast('Network restored. Re-sync verified zero duplicates.');
      return;
    }

    // Apply only pending operations once
    const pendingQty = offlinePendingQueue
      .filter((o) => o.status === 'pending_sync')
      .reduce((acc, curr) => acc + curr.qty, 0);

    setSimulatedStock((prev) => prev + pendingQty);
    setOfflinePendingQueue((prev) =>
      prev.map((o) => ({ ...o, status: 'synced' }))
    );

    setLastSyncResult(`Server confirmed ${pendingCount} pending operation(s). Total stock updated to ${simulatedStock + pendingQty} packs. Repeat syncs will be idempotent.`);
    onShowToast(`Server synchronized ${pendingCount} offline operation(s) safely!`);
  };

  return (
    <div className="space-y-4 pb-14 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Defense Blueprint
              </span>
              <span className="text-xs text-slate-500">Section 11 Architecture</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">System Overview & Cloud Infrastructure</h2>
            <p className="text-xs text-slate-500">Proposed cloud architecture for healthcare supply chain defense</p>
          </div>
        </div>

        {/* PaaS / SaaS Architectural Strategy Card */}
        <div className="grid grid-cols-2 gap-2.5 mt-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
              Application Hosting: PaaS
            </span>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              Platform-as-a-Service containerized infrastructure (managed auto-scaling, isolated network runtime, zero OS patching overhead).
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
              Deployment Model: SaaS
            </span>
            <p className="text-slate-700 text-[11px] leading-relaxed">
              Software-as-a-Service multi-tenant delivery for hospitals and regional health departments (turnkey deployment without on-premise servers).
            </p>
          </div>
        </div>
      </div>

      {/* End-to-End Architectural Data Flow Schematic */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Cloud className="w-4 h-4 text-blue-400" />
            End-to-End Pipeline & Tier Separation
          </h3>
          <span className="text-[10px] bg-slate-800 text-blue-300 px-2 py-0.5 rounded font-mono border border-slate-700">
            Proposed Cloud Architecture
          </span>
        </div>

        {/* Visual Node Diagram */}
        <div className="space-y-3">
          {/* Node 1: Client Layer */}
          <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">1. Presentation Tier</span>
                <span className="text-[11px] text-slate-300">Web Browser / Mobile App (Clinicians, Logisticians, Storekeepers)</span>
              </div>
            </div>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded font-mono">
              React + Vite
            </span>
          </div>

          {/* Connection 1: Network Transport & HTTPS */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-mono py-0.5">
            <span>LAN, Wi-Fi or Mobile 4G/5G Network</span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              HTTPS / TLS 1.3
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            <span>Public Internet Gateway</span>
          </div>

          {/* Node 2: Application Service (PaaS) */}
          <div className="p-3 rounded-xl bg-blue-950/80 border border-blue-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-md">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">2. Application Core Service (PaaS)</span>
                <span className="text-[11px] text-blue-200">MedBalance Core API · Validation, Digital Signature, Business Logic</span>
              </div>
            </div>
            <span className="text-[10px] bg-blue-400/20 text-blue-300 px-2 py-0.5 rounded font-mono">
              Node / Express PaaS
            </span>
          </div>

          {/* Connection 2: Internal Isolated VPC (No direct client access!) */}
          <div className="flex items-center justify-center gap-2 text-[10px] text-amber-300 font-mono py-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Isolated Private Subnet (No direct client database access!)</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
          </div>

          {/* Node 3: Storage Layer */}
          <div className="p-3 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">3. Data & Document Storage Tier</span>
                <span className="text-[11px] text-slate-300">Encrypted Relational Store, Immutable Audit Trail, Document Hash Vault</span>
              </div>
            </div>
            <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono">
              Database Vault
            </span>
          </div>
        </div>

        {/* Security Rule Note */}
        <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/80 text-[11px] text-slate-300 flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Architectural Guarantee:</strong> Web and mobile clients strictly communicate through the MedBalance application service via HTTPS. Direct client read/write access to the database layer is blocked by network firewall.
          </span>
        </div>
      </div>

      {/* 5 Named Data Flows (Prompt Section 11 Specification) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          5 Core System Data Flows
        </h3>
        <p className="text-xs text-slate-500">
          Click any stream to inspect payload types and security controls:
        </p>

        <div className="space-y-2">
          {dataFlows.map((flow) => {
            const Icon = flow.icon;
            const isSelected = selectedFlow === flow.id;
            return (
              <div
                key={flow.id}
                onClick={() => setSelectedFlow(isSelected ? null : flow.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  isSelected ? `${flow.color} ring-2 ring-blue-200` : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0 text-slate-700" />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block leading-tight">{flow.title}</span>
                      <span className="text-[10px] text-slate-500">{flow.titleRu}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    Flow #{flow.id}
                  </span>
                </div>
                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-700">
                    <p className="text-[11px] leading-relaxed">{flow.desc}</p>
                    <span className="inline-block mt-1 text-[10px] text-emerald-700 font-semibold bg-white/80 px-2 py-0.5 rounded border border-emerald-200">
                      Payload: Encrypted JSON over HTTPS · Signed Token
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Offline Simulation Engine (Prompt Section 11 Specification) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                Simulation Engine
              </span>
              <span className="text-xs text-slate-400">Offline Resilience Demo</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 mt-0.5">Offline Operation & Idempotent Reconciliation</h3>
          </div>
          <button
            onClick={() => {
              if (isOnline) {
                setIsOnline(false);
                onShowToast('Network simulated offline: Wi-Fi/4G connection disconnected.');
              } else {
                handleReconnectAndSync();
              }
            }}
            className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all ${
              isOnline 
                ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300' 
                : 'bg-red-100 text-red-800 hover:bg-red-200 border border-red-300 animate-pulse'
            }`}
          >
            {isOnline ? <Wifi className="w-3.5 h-3.5 text-emerald-600" /> : <WifiOff className="w-3.5 h-3.5 text-red-600" />}
            {isOnline ? 'Network: Online' : 'Network: Offline (Simulated)'}
          </button>
        </div>

        {/* Offline Simulation Rules Description */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            Demonstration Protocol:
          </div>
          <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-1">
            <li>When disconnected, operations save locally with status <strong>Pending sync</strong>.</li>
            <li>Total stock balance <strong>does not change yet</strong> (prevents unverified phantom stock).</li>
            <li>Upon reconnecting, the server confirms the operation and increments the stock safely.</li>
            <li>Repeated synchronization triggers an <strong>idempotency check</strong>, preventing double-counting!</li>
          </ul>
        </div>

        {/* Stock Balance State in Simulation */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[10px] text-slate-400 block font-semibold">Verified Server Balance</span>
            <span className="text-lg font-bold text-slate-900">{formatNumber(simulatedStock)} packs</span>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
            <span className="text-[10px] text-blue-600 block font-semibold">Pending Local Queue</span>
            <span className="text-lg font-bold text-blue-900">
              {offlinePendingQueue.filter((o) => o.status === 'pending_sync').length} operation(s)
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handlePerformOfflineOperation}
            className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2 px-3 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            Perform Warehouse Intake (+20 packs)
          </button>

          <button
            onClick={handleReconnectAndSync}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2 px-3 rounded-xl text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reconnect & Idempotent Resync
          </button>
        </div>

        {/* Last Sync Result Log */}
        {lastSyncResult && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">{lastSyncResult}</p>
          </div>
        )}

        {/* Pending Queue List */}
        {offlinePendingQueue.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Local Operation Queue:
            </span>
            {offlinePendingQueue.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] border border-slate-200"
              >
                <div>
                  <span className="font-semibold text-slate-800">{item.operation}</span>
                  <span className="text-slate-400 block text-[10px]">{item.timestamp}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  item.status === 'pending_sync' 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {item.status === 'pending_sync' ? 'Pending Sync' : 'Server Confirmed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
