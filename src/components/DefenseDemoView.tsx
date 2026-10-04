import React, { useState } from 'react';
import { 
  Play, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck, 
  FileText, 
  Building2, 
  Truck, 
  Package, 
  Lock, 
  Key, 
  Layers, 
  Clock, 
  XCircle, 
  Radio, 
  ChevronRight,
  TrendingDown,
  FileCheck,
  AlertOctagon,
  Scan,
  RefreshCw,
  Ban,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  INITIAL_DEMO_DATA, 
  DemoSupplier, 
  DemoRequisition, 
  DemoShipment, 
  DemoWarehouseStock, 
  SecurityEvent,
  DirectContract 
} from '../data/demoScenarioData';
import { formatCurrencyKzt, formatNumber } from '../utils/formatters';

interface DefenseDemoViewProps {
  onOpenSignatureModal: () => void;
  onOpenContractModal: () => void;
  onNavigateToTab: (tab: 'delivery' | 'warehouse' | 'system') => void;
  requisition: DemoRequisition;
  setRequisition: React.Dispatch<React.SetStateAction<DemoRequisition>>;
  shipment: DemoShipment;
  setShipment: React.Dispatch<React.SetStateAction<DemoShipment>>;
  stockState: DemoWarehouseStock;
  setStockState: React.Dispatch<React.SetStateAction<DemoWarehouseStock>>;
  onShowToast: (msg: string) => void;
}

export const DefenseDemoView: React.FC<DefenseDemoViewProps> = ({
  onOpenSignatureModal,
  onOpenContractModal,
  onNavigateToTab,
  requisition,
  setRequisition,
  shipment,
  setShipment,
  stockState,
  setStockState,
  onShowToast,
}) => {
  // Step indicator (1 to 8)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Supplier selection state in Step 2/3
  const [selectedSupplierId, setSelectedSupplierId] = useState<'supplier-a' | 'supplier-b' | null>(null);
  const [supplierAErrorTriggered, setSupplierAErrorTriggered] = useState<boolean>(false);

  // Step 1: Deficit Math Constants
  const itemData = INITIAL_DEMO_DATA.item;
  const suppliers = INITIAL_DEMO_DATA.suppliers;

  // Handler: Start Demo
  const handleStartDemo = () => {
    setCurrentStep(1);
    setSelectedSupplierId(null);
    setSupplierAErrorTriggered(false);
    onShowToast('Midterm Defense Scenario Initialized (Step 1 of 8)');
  };

  // Handler: Reset Demo
  const handleResetDemo = () => {
    setCurrentStep(1);
    setSelectedSupplierId(null);
    setSupplierAErrorTriggered(false);
    setRequisition({
      id: INITIAL_DEMO_DATA.references.requisitionId,
      version: 'v1.0',
      itemCode: INITIAL_DEMO_DATA.item.code,
      itemName: INITIAL_DEMO_DATA.item.name,
      accountingUnit: INITIAL_DEMO_DATA.item.unit,
      orderedQty: 300,
      selectedSupplier: 'Demo Supplier B',
      procurementRoute: 'RFQ',
      rfqId: INITIAL_DEMO_DATA.references.rfqId,
      unitPriceKzt: 6000,
      deliveryFeeKzt: 150000,
      totalCostKzt: 1950000,
      budgetLimitKzt: 2000000,
      deliveryAddress: INITIAL_DEMO_DATA.organization.address,
      organizationName: INITIAL_DEMO_DATA.organization.name,
      organizationId: INITIAL_DEMO_DATA.organization.id,
      author: INITIAL_DEMO_DATA.references.author,
      approver: INITIAL_DEMO_DATA.references.signer,
      status: 'pending_approval',
      hashSha256: '8e41bc720a45f9d6b2c9381ea8b3940173e1c62f928e4610d05c21980a37b120',
      tampered: false,
    });
    setShipment({
      orderId: INITIAL_DEMO_DATA.references.orderId,
      shipmentId: INITIAL_DEMO_DATA.references.shipmentId,
      carrier: INITIAL_DEMO_DATA.references.carrier,
      originCity: 'Karaganda Logistics Depot',
      destinationCity: 'Astana',
      hospitalAddress: INITIAL_DEMO_DATA.organization.address,
      driverName: 'Serik Akhmetov',
      vehiclePlate: '104 KZ 01',
      packsCount: 300,
      lotNumber: INITIAL_DEMO_DATA.references.lotNumber,
      expiryDate: '2028-11-30',
      status: 'in_transit',
      progressPercent: 65,
      currentCoordinates: { lat: 50.85, lng: 71.9 },
      etaDays: 12,
      isDelayed: false,
      lastUpdated: '5 mins ago',
      temperatureColdChain: '+4.2°C (Optimal)',
    });
    setStockState({
      ...INITIAL_DEMO_DATA.stockState,
      currentStock: 180,
    });
    onShowToast('Demo reset to Step 1 initial parameters.');
  };

  // Handler: Select Supplier A (triggers error in Step 3)
  const handleSelectSupplierA = () => {
    setSelectedSupplierId('supplier-a');
    setSupplierAErrorTriggered(true);
    setCurrentStep(3);
    onShowToast('Verification Check: Supplier A warehouse inventory dropped to 200 packs! Submission blocked.');
  };

  // Handler: Select Supplier B (valid flow in Step 4)
  const handleSelectSupplierB = () => {
    setSelectedSupplierId('supplier-b');
    setSupplierAErrorTriggered(false);
    setRequisition((prev) => ({
      ...prev,
      selectedSupplier: 'Demo Supplier B',
      unitPriceKzt: 6000,
      deliveryFeeKzt: 150000,
      totalCostKzt: 1950000,
      status: 'pending_approval',
    }));
    setCurrentStep(4);
    onShowToast('Demo Supplier B selected: 1 950 000 KZT (within 2 000 000 KZT budget limit).');
  };

  // Handler: Order Dispatch in Step 6
  const handleDispatchOrder = () => {
    setRequisition((prev) => ({ ...prev, status: 'sent_to_supplier' }));
    setShipment((prev) => ({ ...prev, status: 'confirmed' }));
    setCurrentStep(6);
    onShowToast('Purchase Order MB-DEMO-104 generated and confirmed by Demo Supplier B!');
  };

  return (
    <div className="space-y-4 pb-14 animate-in fade-in duration-200">
      {/* Top Header Card with Start & Reset Demo Buttons */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                KZ-DEMO-01
              </span>
              <span className="text-xs text-slate-500 font-semibold">Astana Demo Hospital</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">Midterm Defense Demonstration Path</h2>
            <p className="text-xs text-slate-500">End-to-end procurement, digital signature & warehouse intake</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartDemo}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-xs shadow-blue-600/20 flex items-center gap-1.5 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Start Demo
            </button>
            <button
              onClick={handleResetDemo}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 p-1.5 rounded-xl text-xs font-semibold flex items-center transition-all"
              title="Reset Demo"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step Progression Ribbon (1 to 8) */}
        <div className="mt-3.5 pt-1">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-2">
            <span>Scenario Progress: Step {currentStep} of 8</span>
            <span className="text-blue-600 font-mono">
              {currentStep === 1 ? '1. Stock Risk Calculation' :
               currentStep === 2 ? '2. RFQ Supplier Comparison' :
               currentStep === 3 ? '3. Supplier A Shortage Block' :
               currentStep === 4 ? '4. Supplier B Selection' :
               currentStep === 5 ? '5. Approver Digital Signature' :
               currentStep === 6 ? '6. Order Dispatch & PO' :
               currentStep === 7 ? '7. Live Delivery Corridor' : '8. Warehouse Intake (280/300)'}
            </span>
          </div>

          <div className="grid grid-cols-8 gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((step) => {
              const isPast = step < currentStep;
              const isCurrent = step === currentStep;
              return (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step)}
                  className={`h-2 rounded-full transition-all ${
                    isCurrent 
                      ? 'bg-blue-600 ring-2 ring-blue-300' 
                      : isPast 
                      ? 'bg-emerald-500' 
                      : 'bg-slate-200'
                  }`}
                  title={`Step ${step}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* STEP 1: RISK & DEFICIT CALCULATION (DEMO-M01) */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                Risk Alert: Stockout in 17.1 Days
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                Item: {itemData.code} — Educational Item
              </h3>
              <p className="text-[11px] text-slate-500">{itemData.nameRu}</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-800">Unit: {itemData.unit}</span>
            </div>
          </div>

          {/* Mathematical Deficit Breakdown Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Initial Stock</span>
              <span className="font-bold text-slate-900 text-sm">{itemData.initialStock} packs</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Daily Consumption</span>
              <span className="font-bold text-slate-900 text-sm">{itemData.dailyConsumption} packs/day</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Current Coverage</span>
              <span className="font-bold text-amber-700 text-sm">{itemData.coverageDays} days</span>
              <span className="text-[9px] text-slate-400 block">(600 / 35 ≈ 17.1d)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-400 block">Planned Delivery</span>
              <span className="font-bold text-slate-900 text-sm">Day {itemData.plannedDeliveryDay}</span>
            </div>
          </div>

          {/* Order Need Formula Box (Prompt Section 12 Specification) */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3 text-xs text-blue-950 space-y-2">
            <div className="font-bold flex items-center justify-between text-blue-900">
              <span>Predictive Requirement Calculation to Day 25:</span>
              <span className="font-mono text-xs">Formula: 25 × 35 − 600</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-blue-200">
                <span className="text-[10px] text-slate-500 block">Need until Day 25</span>
                <span className="font-extrabold text-slate-800 text-sm">275 packs</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-200">
                <span className="text-[10px] text-slate-500 block">Safety Reserve</span>
                <span className="font-extrabold text-emerald-700 text-sm">+25 packs</span>
              </div>
              <div className="bg-blue-600 text-white p-2 rounded-lg shadow-xs">
                <span className="text-[10px] text-blue-100 block font-semibold">Recommended Order</span>
                <span className="font-black text-sm">300 packs</span>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1 text-[11px] text-slate-600">
              <span>Demo Requisition Budget Limit:</span>
              <span className="font-bold text-slate-900">{formatCurrencyKzt(itemData.budgetLimitKzt)}</span>
            </div>
          </div>

          {/* Next Action Button */}
          <button
            onClick={() => setCurrentStep(2)}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <span>Proceed to RFQ-DEMO-021: Compare Suppliers A & B</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2: OPEN RFQ & COMPARE SUPPLIER A & B */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {INITIAL_DEMO_DATA.references.rfqId}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Supplier Quotation Comparison</h3>
              <p className="text-[11px] text-slate-500">Volume required: 300 packs · Budget limit: 2 000 000 KZT</p>
            </div>
            <button
              onClick={onOpenContractModal}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              <FileText className="w-3.5 h-3.5" />
              Check Contract Route
            </button>
          </div>

          {/* Supplier Comparison Table (Prompt Section 12 Specification) */}
          <div className="space-y-3">
            {/* Supplier A Card */}
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60 hover:bg-slate-50 transition-all space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{suppliers.supplierA.name}</h4>
                  <span className="text-[10px] text-slate-500">Reliability Score: {suppliers.supplierA.reliabilityScore}%</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 text-sm">{formatCurrencyKzt(suppliers.supplierA.totalCostKzt)}</span>
                  <span className="text-[10px] text-emerald-600 block">Lowest Total Price</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px]">Unit Price:</span>
                  <span className="font-semibold text-slate-800">{formatCurrencyKzt(suppliers.supplierA.pricePerPackKzt)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Delivery Fee:</span>
                  <span className="font-semibold text-slate-800">{formatCurrencyKzt(suppliers.supplierA.deliveryCostKzt)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Delivery Day:</span>
                  <span className="font-bold text-slate-800">Day {suppliers.supplierA.deliveryScheduleDay}</span>
                </div>
              </div>

              <button
                onClick={handleSelectSupplierA}
                className="w-full mt-2 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Select Demo Supplier A (Simulate Availability Error Event)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Supplier B Card */}
            <div className="border-2 border-blue-500/40 rounded-xl p-3.5 bg-blue-50/30 hover:bg-blue-50/50 transition-all space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">{suppliers.supplierB.name}</h4>
                  <span className="text-[10px] text-slate-500">Reliability Score: {suppliers.supplierB.reliabilityScore}%</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 text-sm">{formatCurrencyKzt(suppliers.supplierB.totalCostKzt)}</span>
                  <span className="text-[10px] text-blue-600 block">Within Budget (&le; 2.0M ₸)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 border-t border-blue-200/60">
                <div>
                  <span className="text-slate-400 block text-[10px]">Unit Price:</span>
                  <span className="font-semibold text-slate-800">{formatCurrencyKzt(suppliers.supplierB.pricePerPackKzt)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Delivery Fee:</span>
                  <span className="font-semibold text-slate-800">{formatCurrencyKzt(suppliers.supplierB.deliveryCostKzt)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Delivery Day:</span>
                  <span className="font-bold text-slate-800">Day {suppliers.supplierB.deliveryScheduleDay}</span>
                </div>
              </div>

              <button
                onClick={handleSelectSupplierB}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2 px-3 rounded-lg text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Select Demo Supplier B for 1 950 000 KZT</span>
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: SUPPLIER A ERROR EVENT — AVAILABILITY DROPS TO 200 */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl p-4 border border-red-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3 text-red-600 pb-2 border-b border-red-100">
            <AlertOctagon className="w-6 h-6 shrink-0" />
            <div>
              <h3 className="text-sm font-bold">Verification Error: Supplier Inventory Shortage</h3>
              <p className="text-[11px] text-red-500">Submission blocked · Requisition draft retained</p>
            </div>
          </div>

          {/* Detailed Error Banner (Prompt Section 12 Specification) */}
          <div className="p-3 bg-red-50 border border-red-300 rounded-xl space-y-2 text-xs text-red-900">
            <div className="font-bold flex items-center justify-between">
              <span>Demo Supplier A Availability Mismatch:</span>
              <span className="bg-red-200 text-red-800 px-2 py-0.5 rounded text-[10px] font-mono">
                Available: 200 / Required: 300
              </span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Automated API inventory validation with Demo Supplier A depot reveals that warehouse availability unexpectedly dropped from 300 to <strong>200 packs</strong>. Order dispatch is strictly blocked to protect clinical continuity.
            </p>
            <div className="text-[10px] bg-white/80 p-2 rounded border border-red-200 font-mono text-red-800">
              Error Code: ERR_SUPPLIER_VOLUME_DEFICIT (Shortfall: 100 packs). Requisition REQ-DEMO-104 saved as Draft.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all"
            >
              Return to Supplier Comparison
            </button>
            <button
              onClick={handleSelectSupplierB}
              className="flex-1 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Select Supplier B (1 950 000 KZT)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUPPLIER B VALID SELECTION CONFIRMATION */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Supplier B Validated
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Requisition REQ-DEMO-104 Ready for Review</h3>
              <p className="text-[11px] text-slate-500">All substantive terms defined prior to digital signature</p>
            </div>
            <span className="text-xs font-bold text-slate-800">Version: {requisition.version}</span>
          </div>

          {/* Substantive Terms Inspection (Prompt Section 6 & 12 Specification) */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Document Pre-Signature Audit:
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 block">Item & Quantity:</span>
                <span className="font-bold text-slate-800">DEMO-M01 · 300 packs</span>
              </div>
              <div>
                <span className="text-slate-400 block">Selected Vendor:</span>
                <span className="font-bold text-slate-800">Demo Supplier B</span>
              </div>
              <div>
                <span className="text-slate-400 block">Procurement Route:</span>
                <span className="font-bold text-blue-600 font-mono">RFQ-DEMO-021 (Competitive)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Total Expenditure:</span>
                <span className="font-bold text-slate-900">{formatCurrencyKzt(requisition.totalCostKzt)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Author & Signer:</span>
                <span className="font-semibold text-slate-700">{requisition.author} ➔ {requisition.approver}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Delivery Location:</span>
                <span className="font-semibold text-slate-700 truncate block">{requisition.deliveryAddress}</span>
              </div>
            </div>
          </div>

          {/* Action to Launch Signature Flow */}
          <button
            onClick={() => {
              setCurrentStep(5);
              onOpenSignatureModal();
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <Key className="w-4 h-4" />
            <span>Open Approver Digital Signature & Cryptographic Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 5: APPROVER DIGITAL SIGNATURE & VERIFICATION */}
      {currentStep === 5 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                requisition.status === 'approved_signed'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {requisition.status === 'approved_signed' ? 'Approved & Signed' : 'Pending Approver Signature'}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                Approver Electronic Signature (REQ-DEMO-104)
              </h3>
              <p className="text-[11px] text-slate-500">Signer: {requisition.approver} · Demo signature mode</p>
            </div>
            <button
              onClick={onOpenSignatureModal}
              className="text-xs text-blue-600 hover:text-blue-800 underline font-semibold flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" />
              View 5-Step Schematic
            </button>
          </div>

          {/* Visual Lifecycle Ribbon: Draft ➔ Pending ➔ Approved ➔ Sent */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Document Lifecycle Status Chain:
            </span>
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-500">1. Draft</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-500">2. Pending Approval</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className={`font-bold ${requisition.status === 'approved_signed' ? 'text-emerald-600' : 'text-slate-400'}`}>
                3. Approved & Signed
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-semibold text-slate-400">4. Sent to Supplier</span>
            </div>
          </div>

          {/* Cryptographic Digest Info */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-bold">SHA-256 Digest:</span>
              <span className="font-mono text-emerald-600">Integrity: Valid</span>
            </div>
            <div className="font-mono text-[10px] text-slate-700 bg-white p-2 rounded border border-slate-200 break-all">
              {requisition.hashSha256}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onOpenSignatureModal}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-3 rounded-xl text-xs font-semibold transition-all"
            >
              Review / Simulate Tamper
            </button>
            <button
              onClick={handleDispatchOrder}
              disabled={requisition.status !== 'approved_signed' || requisition.tampered}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2 px-3 rounded-xl text-xs font-bold shadow-xs shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              <span>Send Order to Demo Supplier B</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: ORDER DISPATCH & SUPPLIER CONFIRMATION */}
      {currentStep === 6 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                PO Dispatched & Confirmed
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Purchase Order MB-DEMO-104</h3>
              <p className="text-[11px] text-slate-500">Supplier: Demo Supplier B · Total: 1 950 000 KZT</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              SHP-DEMO-104
            </span>
          </div>

          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1.5 text-xs text-emerald-950">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Supplier Confirmation Received
            </div>
            <p className="text-[11px] leading-relaxed">
              Demo Supplier B acknowledged order MB-DEMO-104 and scheduled dispatch with carrier <strong>Demo Logistics</strong>. Batch lot <strong>LOT-DEMO-104</strong> prepared with cold-chain sensor monitoring (+4.2°C).
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentStep(7);
              onNavigateToTab('delivery');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs shadow-blue-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <Truck className="w-4 h-4" />
            <span>Open Delivery Tracking Map & Corridor (Step 7)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 7: DELIVERY TRACKING LINK */}
      {currentStep === 7 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Corridor Active
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">Live Shipment SHP-DEMO-104</h3>
              <p className="text-[11px] text-slate-500">Carrier: Demo Logistics · Vehicle: 104 KZ 01</p>
            </div>
            <span className="text-xs font-bold text-slate-800">ETA: Day 12</span>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Transport Progress:</span>
              <span className="font-bold text-blue-600">{shipment.progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${shipment.progressPercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Vehicle in transit on highway corridor to Astana Demo Hospital. <em>Note:</em> Arrival at loading gate does not alter inventory until warehouse intake verification.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigateToTab('delivery')}
              className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Truck className="w-3.5 h-3.5" />
              View Full GPS Map
            </button>
            <button
              onClick={() => {
                setCurrentStep(8);
                onNavigateToTab('warehouse');
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2.5 px-3 rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Go to Mobile Intake (Step 8)</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 8: MOBILE WAREHOUSE RECEIVING & DISCREPANCY JOURNAL */}
      {currentStep === 8 && (
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Step 8: Warehouse Intake Reconciliation
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1">
                Receive 280 Packs (Shortage: -20 packs)
              </h3>
              <p className="text-[11px] text-slate-500">Batch LOT-DEMO-104 · Storekeeper: Demo Warehouse User</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Stock: {stockState.currentStock}
            </span>
          </div>

          {/* Mathematical Stock Reconciliation Card (Prompt Section 13 Specification) */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Exact Day 12 Balance Calculation:
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 block">Pre-Intake Stock</span>
                <span className="font-extrabold text-slate-800 text-sm">180 packs</span>
                <span className="text-[9px] text-slate-400 block">(600 - 12×35)</span>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg border border-blue-200">
                <span className="text-[10px] text-blue-600 font-semibold block">Physically Received</span>
                <span className="font-extrabold text-blue-900 text-sm">+280 packs</span>
                <span className="text-[9px] text-slate-400 block">(Shortage: 20)</span>
              </div>
              <div className="bg-emerald-600 text-white p-2 rounded-lg shadow-xs">
                <span className="text-[10px] text-emerald-100 block font-semibold">Post-Intake Stock</span>
                <span className="font-black text-sm">460 packs</span>
                <span className="text-[9px] text-emerald-100 block">(180 + 280)</span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-900 text-[11px] leading-relaxed">
              <strong>Audit Journal Entry:</strong> Under-delivery of 20 packs (ordered 300, received 280) logged in incident log. Stock increased strictly to 460 packs. Order MB-DEMO-104 marked as <em>Partially Fulfilled</em>.
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('warehouse')}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
          >
            <Scan className="w-4 h-4" />
            <span>Open Mobile Warehouse Intake & RFID Gate Scanner</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SEPARATE INTERACTIVE BRANCH BUTTONS (Prompt Section 13 Specification) */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-blue-600" />
            Separate Defense Demonstration Branches
          </span>
          <span className="text-[10px] text-slate-500">Independent test paths</span>
        </div>

        <p className="text-[11px] text-slate-600 leading-snug">
          Click these buttons to showcase critical edge cases without interrupting the main 8-step defense scenario:
        </p>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* Branch 1: Tamper Signed Document */}
          <button
            onClick={onOpenSignatureModal}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left font-semibold text-slate-800 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-amber-700 font-bold text-[11px]">
              <Lock className="w-3.5 h-3.5" />
              1. Document Tamper Test
            </div>
            <span className="text-[10px] text-slate-500 font-normal mt-1">
              Changes 300 ➔ 1000 packs to verify hash failure & dispatch block.
            </span>
          </button>

          {/* Branch 2: Offline Mode Demo */}
          <button
            onClick={() => onNavigateToTab('system')}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left font-semibold text-slate-800 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-blue-700 font-bold text-[11px]">
              <Layers className="w-3.5 h-3.5" />
              2. Offline Sync Demo
            </div>
            <span className="text-[10px] text-slate-500 font-normal mt-1">
              Pending sync queue, stock unmutated, idempotent reconnect.
            </span>
          </button>

          {/* Branch 3: RFID Gate Security Event */}
          <button
            onClick={() => onNavigateToTab('warehouse')}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left font-semibold text-slate-800 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-purple-700 font-bold text-[11px]">
              <Radio className="w-3.5 h-3.5" />
              3. RFID Security Event
            </div>
            <span className="text-[10px] text-slate-500 font-normal mt-1">
              Authorized vs Unmatched movement with verification checklist.
            </span>
          </button>

          {/* Branch 4: Direct Contract Check */}
          <button
            onClick={onOpenContractModal}
            className="p-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-left font-semibold text-slate-800 shadow-2xs hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
              <FileCheck className="w-3.5 h-3.5" />
              4. Direct Contract Check
            </div>
            <span className="text-[10px] text-slate-500 font-normal mt-1">
              Contract CTR-DEMO-A-01 volume quota & Supplier B prohibition.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
