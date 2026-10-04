import React, { useState } from 'react';
import { 
  Scan, 
  PackageCheck, 
  PackageMinus, 
  ClipboardList, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  Building2, 
  ArrowRight, 
  QrCode, 
  RotateCcw,
  Sparkles,
  Info,
  Calendar,
  Layers,
  History,
  AlertOctagon,
  UserCheck
} from 'lucide-react';
import { DemoWarehouseStock, SecurityEvent } from '../data/demoScenarioData';
import { formatNumber } from '../utils/formatters';

interface MobileWarehouseViewProps {
  stockState: DemoWarehouseStock;
  securityEvents: SecurityEvent[];
  onConfirmReceipt: (receivedQty: number) => void;
  onDispense: (dept: string, qty: number) => boolean;
  onSubmitInventoryAudit: (physicalCount: number) => void;
  onSimulateRfidGateEvent: (isAuthorized: boolean) => void;
  onResetWarehouse: () => void;
  onShowToast: (msg: string) => void;
}

export const MobileWarehouseView: React.FC<MobileWarehouseViewProps> = ({
  stockState,
  securityEvents,
  onConfirmReceipt,
  onDispense,
  onSubmitInventoryAudit,
  onSimulateRfidGateEvent,
  onResetWarehouse,
  onShowToast,
}) => {
  const [activeWarehouseTab, setActiveWarehouseTab] = useState<'receiving' | 'dispense' | 'audit' | 'rfid'>('receiving');

  // Receiving state
  const [isScanned, setIsScanned] = useState<boolean>(false);
  const [receivedInputQty, setReceivedInputQty] = useState<number>(280); // default demo scenario: 280
  const [receivingCompleted, setReceivingCompleted] = useState<boolean>(stockState.currentStock >= 460);

  // Dispense state
  const [dispenseDept, setDispenseDept] = useState<string>('Intensive Care Unit (ICU)');
  const [dispenseQty, setDispenseQty] = useState<number>(15);
  const [dispenseLog, setDispenseLog] = useState<{ time: string; dept: string; qty: number; user: string }[]>([
    { time: '09:15', dept: 'Oncology Day Ward', qty: 10, user: 'Demo Warehouse User' },
    { time: '10:40', dept: 'Emergency Dept', qty: 12, user: 'Demo Warehouse User' },
  ]);

  // Inventory audit state
  const [physicalCountInput, setPhysicalCountInput] = useState<number>(stockState.currentStock - 2);
  const [auditSubmitted, setAuditSubmitted] = useState<boolean>(false);

  // Handle Receiving Submission
  const handleIntakeSubmit = () => {
    onConfirmReceipt(receivedInputQty);
    setReceivingCompleted(true);
    onShowToast(`Intake confirmed: +${receivedInputQty} packs added. Stock updated to ${stockState.day12PreDeliveryStock + receivedInputQty} packs.`);
  };

  // Handle Dispense
  const handleDispenseSubmit = () => {
    if (dispenseQty <= 0) {
      onShowToast('Please enter a valid quantity.');
      return;
    }
    if (dispenseQty > stockState.currentStock) {
      onShowToast(`Error: Cannot dispense ${dispenseQty} packs. Available stock is only ${stockState.currentStock} packs!`);
      return;
    }

    const success = onDispense(dispenseDept, dispenseQty);
    if (success) {
      setDispenseLog([
        { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), dept: dispenseDept, qty: dispenseQty, user: stockState.storekeeperName },
        ...dispenseLog,
      ]);
      onShowToast(`Dispensed ${dispenseQty} packs to ${dispenseDept}. Deducted from inventory.`);
    }
  };

  // Handle Inventory Audit Submission
  const handleAuditSubmit = () => {
    onSubmitInventoryAudit(physicalCountInput);
    setAuditSubmitted(true);
    onShowToast('Discrepancy adjustment submitted to Chief Pharmacist for verification.');
  };

  const calculatedRemaining = Math.max(0, stockState.orderedQty - receivedInputQty);

  return (
    <div className="space-y-4 pb-14 animate-in fade-in duration-200">
      {/* Philosophy Banner (Strict Prompt Directive) */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 border border-blue-400/30">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
              Core Architectural Principle
            </div>
            <p className="text-xs font-semibold text-slate-100 mt-0.5 leading-snug">
              «Подозрительное событие — основание для проверки, а не автоматическое доказательство кражи.»
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              A suspicious event triggers an inspection workflow, never automated accusation of theft.
            </p>
          </div>
        </div>
      </div>

      {/* Stock Overview Banner */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Astana Demo Hospital · Central Depot
            </span>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              {stockState.itemCode}: {formatNumber(stockState.currentStock)} {stockState.unit}s
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
              {((stockState.currentStock) / stockState.dailyConsumption).toFixed(1)} Days Coverage
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">Storekeeper: {stockState.storekeeperName}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Day 12 Stock</span>
            <span className="font-bold text-slate-800">{stockState.day12PreDeliveryStock} packs</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Daily Consumption</span>
            <span className="font-bold text-slate-800">35 packs/day</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="text-[10px] text-slate-400 block">Safety Reserve</span>
            <span className="font-bold text-emerald-700">25 packs</span>
          </div>
        </div>
      </div>

      {/* Warehouse Navigation Segmented Bar */}
      <div className="bg-slate-200/80 p-1 rounded-xl grid grid-cols-4 gap-1 text-xs font-semibold">
        <button
          onClick={() => setActiveWarehouseTab('receiving')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            activeWarehouseTab === 'receiving' 
              ? 'bg-white text-blue-600 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="block text-[11px] leading-tight">1. Intake</span>
        </button>

        <button
          onClick={() => setActiveWarehouseTab('dispense')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            activeWarehouseTab === 'dispense' 
              ? 'bg-white text-blue-600 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="block text-[11px] leading-tight">2. Dispense</span>
        </button>

        <button
          onClick={() => setActiveWarehouseTab('audit')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            activeWarehouseTab === 'audit' 
              ? 'bg-white text-blue-600 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="block text-[11px] leading-tight">3. Cycle Count</span>
        </button>

        <button
          onClick={() => setActiveWarehouseTab('rfid')}
          className={`py-2 px-1 rounded-lg text-center transition-all ${
            activeWarehouseTab === 'rfid' 
              ? 'bg-white text-blue-600 shadow-xs' 
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="block text-[11px] leading-tight">4. RFID Gates</span>
        </button>
      </div>

      {/* TAB 1: RECEIVING / INTAKE */}
      {activeWarehouseTab === 'receiving' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">PO Intake: MB-DEMO-104</h3>
              <p className="text-[11px] text-slate-500">RFQ: RFQ-DEMO-021 · Carrier: Demo Logistics</p>
            </div>
            <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-200 font-bold">
              LOT-DEMO-104
            </span>
          </div>

          {/* Barcode / DataMatrix Scan Simulator */}
          <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center space-y-2.5">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">
                {isScanned ? 'Data Matrix Verified: LOT-DEMO-104' : 'Optical 2D Data Matrix Scanner'}
              </div>
              <p className="text-[11px] text-slate-500">
                {isScanned 
                  ? 'Item: DEMO-M01 · Expiry: 2028-11-30 · Origin: Demo Supplier B' 
                  : 'Scan shipping pallet tag or click button to simulate handheld laser read'}
              </p>
            </div>

            <button
              onClick={() => {
                setIsScanned(true);
                onShowToast('Optical scan verified: DEMO-M01 (LOT-DEMO-104)');
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2 px-4 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <Scan className="w-4 h-4" />
              {isScanned ? 'Re-scan Pallet Tag' : 'Simulate Handheld Optical Scan'}
            </button>
          </div>

          {/* Intake Quantity Table (Prompt Section 9 specification) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Intake Reconciliation Grid
            </div>

            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Ordered</span>
                <span className="font-bold text-slate-800 text-sm">300</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Prev. Received</span>
                <span className="font-bold text-slate-800 text-sm">0</span>
              </div>
              <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-200">
                <span className="text-[10px] text-blue-600 font-bold block">Received Now</span>
                <span className="font-extrabold text-blue-900 text-sm">{receivedInputQty}</span>
              </div>
              <div className={`p-2.5 rounded-xl border ${
                calculatedRemaining > 0 ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
              }`}>
                <span className="text-[10px] block font-semibold">Remaining</span>
                <span className="font-extrabold text-sm">{calculatedRemaining}</span>
              </div>
            </div>

            {/* Input Slider / Stepper for Actual Count */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-slate-700">Enter Verified Physical Intake Count:</label>
                <span className="font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {receivedInputQty} packs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setReceivedInputQty(Math.max(100, receivedInputQty - 10))}
                  className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg font-bold text-slate-700 active:scale-95"
                >
                  -10
                </button>
                <input
                  type="range"
                  min="200"
                  max="300"
                  step="5"
                  value={receivedInputQty}
                  onChange={(e) => setReceivedInputQty(Number(e.target.value))}
                  className="flex-1 accent-blue-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <button 
                  onClick={() => setReceivedInputQty(Math.min(300, receivedInputQty + 10))}
                  className="bg-white border border-slate-300 px-3 py-1.5 rounded-lg font-bold text-slate-700 active:scale-95"
                >
                  +10
                </button>
              </div>
            </div>

            {/* Under-delivery discrepancy explanation */}
            {calculatedRemaining > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Shortage Documented: -{calculatedRemaining} packs under-delivery
                </div>
                <p className="text-[11px] leading-relaxed">
                  Ordered 300, physical count reveals 280 packs. System updates stock from <strong>180 ➔ 460 packs</strong>. Discrepancy of 20 packs is recorded in the Discrepancy Journal, and order MB-DEMO-104 remains in status <em>Partially Fulfilled</em>.
                </p>
              </div>
            )}

            {/* Confirm Intake Action Button */}
            <button
              onClick={handleIntakeSubmit}
              disabled={receivingCompleted}
              className={`w-full py-3 px-4 rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all ${
                receivingCompleted
                  ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white shadow-emerald-600/20'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              {receivingCompleted 
                ? 'Intake Already Processed (Stock: 460 packs)' 
                : `Confirm Intake of ${receivedInputQty} Packs (Stock ➔ 460)`}
            </button>
          </div>
        </div>
      )}

      {/* TAB 2: DISPENSE TO HOSPITAL DEPARTMENTS */}
      {activeWarehouseTab === 'dispense' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Internal Dispense / Outward Release</h3>
              <p className="text-[11px] text-slate-500">Authorized release to clinical units</p>
            </div>
            <span className="text-xs font-bold text-slate-700">
              Available: {formatNumber(stockState.currentStock)} packs
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Department:</label>
              <select
                value={dispenseDept}
                onChange={(e) => setDispenseDept(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-800 font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
                <option value="Emergency Department">Emergency Department</option>
                <option value="Surgical Operating Theatres">Surgical Operating Theatres</option>
                <option value="Oncology Day Inpatient Ward">Oncology Day Inpatient Ward</option>
                <option value="Pediatric Clinical Depot">Pediatric Clinical Depot</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700">Dispense Quantity (Packs):</label>
                <span className="text-[10px] text-slate-500">Max: {stockState.currentStock}</span>
              </div>
              <input
                type="number"
                min="1"
                max={stockState.currentStock}
                value={dispenseQty}
                onChange={(e) => setDispenseQty(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {dispenseQty > stockState.currentStock && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-[11px] flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-red-600 shrink-0" />
                <span>Over-limit! Cannot dispense more than currently verified stock ({stockState.currentStock} packs).</span>
              </div>
            )}

            <button
              onClick={handleDispenseSubmit}
              disabled={dispenseQty <= 0 || dispenseQty > stockState.currentStock}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <PackageMinus className="w-4 h-4" />
              Confirm Dispense ({dispenseQty} packs to {dispenseDept})
            </button>
          </div>

          {/* Dispense Audit Trail */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-slate-500" />
              Verified Dispense Audit Trail
            </span>
            <div className="space-y-1.5">
              {dispenseLog.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 text-[11px] border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-800">{log.dept}</span>
                    <span className="text-slate-400 block text-[10px]">By {log.user} at {log.time}</span>
                  </div>
                  <span className="font-bold text-blue-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    -{log.qty} packs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INVENTORY CYCLE COUNT / AUDIT */}
      {activeWarehouseTab === 'audit' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Inventory Cycle Count</h3>
              <p className="text-[11px] text-slate-500">Routine physical reconciliation</p>
            </div>
            <span className="text-xs font-mono font-bold text-slate-700">
              DEMO-M01
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block">System Book Count</span>
                <span className="text-base font-bold text-slate-900">{stockState.currentStock} packs</span>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-center">
                <span className="text-[10px] text-blue-600 font-semibold block">Physical Count Input</span>
                <span className="text-base font-bold text-blue-900">{physicalCountInput} packs</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Enter Physical Verified Count:
              </label>
              <input
                type="number"
                value={physicalCountInput}
                onChange={(e) => setPhysicalCountInput(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Variance Calculation */}
            <div className={`p-3 rounded-xl border ${
              physicalCountInput !== stockState.currentStock 
                ? 'bg-amber-50 border-amber-300 text-amber-900' 
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}>
              <div className="font-bold flex items-center justify-between">
                <span>Calculated Variance:</span>
                <span className="font-mono text-sm">
                  {physicalCountInput - stockState.currentStock > 0 ? `+${physicalCountInput - stockState.currentStock}` : physicalCountInput - stockState.currentStock} packs
                </span>
              </div>
              <p className="text-[11px] mt-1 text-slate-600 leading-snug">
                <strong>Audit Compliance Rule:</strong> Discrepancies are submitted to the inspection committee with explanation; data is <em>never silently overwritten</em> without documented approval.
              </p>
            </div>

            <button
              onClick={handleAuditSubmit}
              disabled={auditSubmitted}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all"
            >
              <ClipboardList className="w-4 h-4" />
              {auditSubmitted ? 'Audit Submitted for Review' : 'Submit Variance for Chief Pharmacist Review'}
            </button>
          </div>
        </div>
      )}

      {/* TAB 4: RFID & MOVEMENT SECURITY EVENTS (Prompt Section 10) */}
      {activeWarehouseTab === 'rfid' && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900">RFID Movement & Security Events</h3>
              <p className="text-[11px] text-slate-500">Portal sensors at warehouse perimeter</p>
            </div>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">
              Hardware: Impinj R420
            </span>
          </div>

          {/* Technological Clarification Note as requested */}
          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <span>
              <strong>Technology Clarification:</strong> 2D Data Matrix / QR codes are used for optical scanning on phones. RFID exit gates use dedicated physical portal antenna arrays. The buttons below simulate physical hardware telemetry.
            </span>
          </div>

          {/* Security Events List */}
          <div className="space-y-2.5">
            {securityEvents.map((evt) => (
              <div 
                key={evt.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  evt.status === 'authorized'
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-red-50/70 border-red-300 ring-2 ring-red-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {evt.status === 'authorized' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertOctagon className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-mono text-xs font-bold text-slate-800">
                      {evt.rfidTagId}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      evt.status === 'authorized' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {evt.status === 'authorized' ? 'Authorized Exit' : 'Unmatched Movement — Inspection Required'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                </div>

                <div className="mt-2 text-xs text-slate-700 space-y-1">
                  <div>
                    <span className="text-slate-400">Sensor:</span> {evt.exitGateZone}
                  </div>
                  <div>
                    <span className="text-slate-400">Item:</span> {evt.itemName}
                  </div>
                  <p className="text-[11px] mt-1 text-slate-600 leading-snug bg-white/70 p-2 rounded border border-slate-200">
                    {evt.verificationOutcome}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Simulation Controls for RFID Hardware */}
          <div className="bg-slate-100 rounded-xl p-3 border border-slate-200 space-y-2">
            <span className="text-xs font-bold text-slate-800 block">
              Simulate Gate Hardware Event
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  onSimulateRfidGateEvent(true);
                  onShowToast('Simulated Gate Event: Authorized movement registered (Green)');
                }}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2 px-3 rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Simulate Authorized Movement
              </button>

              <button
                onClick={() => {
                  onSimulateRfidGateEvent(false);
                  onShowToast('Simulated Gate Event: Unmatched movement flagged for inspection (Red)');
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 active:scale-95 text-white py-2 px-3 rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <AlertOctagon className="w-3.5 h-3.5" />
                Simulate Unmatched Movement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
