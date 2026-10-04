import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  Send, 
  TrendingUp, 
  ArrowRightLeft, 
  Calendar, 
  Building2, 
  Package, 
  Clock, 
  FileText,
  Layers,
  MapPin
} from 'lucide-react';
import { DrugItem } from '../types';
import { formatNumber, formatCurrencyKzt, getRiskBadgeClass } from '../utils/formatters';

interface DrugForecastModalProps {
  drug: DrugItem | null;
  onClose: () => void;
  onSendAlert: (drug: DrugItem, targetType: string, customMsg: string) => void;
  onTransferStock: (drugId: string, fromRegion: string, toRegion: string, amount: number) => void;
}

export const DrugForecastModal: React.FC<DrugForecastModalProps> = ({
  drug,
  onClose,
  onSendAlert,
  onTransferStock,
}) => {
  if (!drug) return null;

  const [activeSubTab, setActiveSubTab] = useState<'trajectory' | 'regions' | 'transfer' | 'alert'>('trajectory');
  const [transferFrom, setTransferFrom] = useState(drug.regionalDistribution[2]?.region || drug.regionalDistribution[0]?.region);
  const [transferTo, setTransferTo] = useState(drug.regionalDistribution[0]?.region || '');
  const [transferAmount, setTransferAmount] = useState(1000);
  const [transferSuccess, setTransferSuccess] = useState(false);

  // Alert form state
  const [alertTarget, setAlertTarget] = useState<'sk_pharmacy' | 'pharmacy_chain' | 'hospital_inpatient'>('sk_pharmacy');
  const [alertNote, setAlertNote] = useState(`Warning! Stock exhaustion projected for ${drug.name} in ${drug.burnoutDays} days. Scheduled delivery arrives only in ${drug.nextDeliveryDays} days. Supply chain intervention required.`);
  const [alertSent, setAlertSent] = useState(false);

  // Calculate 45-day depletion points for SVG chart
  const daysHorizon = 45;
  const points = [];
  let simulatedStock = drug.currentStock;
  const dailyBurn = drug.dailyConsumption;

  for (let day = 0; day <= daysHorizon; day++) {
    // If next delivery arrives on this day, add the delivery qty
    if (day === drug.nextDeliveryDays) {
      simulatedStock += drug.nextDeliveryQty;
    }
    const currentPointStock = Math.max(0, simulatedStock);
    points.push({ day, stock: currentPointStock });
    simulatedStock -= dailyBurn;
  }

  // Calculate max stock for scaling
  const maxStock = Math.max(
    drug.currentStock + drug.nextDeliveryQty,
    drug.currentStock * 1.5,
    5000
  );

  const handleExecuteTransfer = () => {
    if (transferAmount <= 0) return;
    onTransferStock(drug.id, transferFrom, transferTo, transferAmount);
    setTransferSuccess(true);
    setTimeout(() => setTransferSuccess(false), 3000);
  };

  const handleExecuteAlert = () => {
    onSendAlert(drug, alertTarget, alertNote);
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-start justify-between">
          <div className="space-y-1 pr-2 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${getRiskBadgeClass(drug.riskLevel)}`}>
                {drug.riskLevel === 'critical' ? 'Deficit' :
                 drug.riskLevel === 'warning' ? 'Risk Zone' :
                 drug.riskLevel === 'normal' ? 'Normal' : 'Surplus'}
              </span>
              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                {drug.category}
              </span>
              {drug.isEssential && (
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                  EDL (Essential)
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-snug truncate">
              {drug.name}
            </h2>
            <div className="text-[11px] text-slate-500 font-mono truncate">
              INN: {drug.inn} • {drug.supplier}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Sub-tabs (Horizontal Scroll for Mobile) */}
        <div className="flex border-b border-slate-200 bg-white px-3 gap-1 overflow-x-auto scrollbar-none pt-1">
          <button
            onClick={() => setActiveSubTab('trajectory')}
            className={`py-2 px-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
              activeSubTab === 'trajectory'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Forecast (45d)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('regions')}
            className={`py-2 px-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
              activeSubTab === 'regions'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>KZ Stock</span>
          </button>

          <button
            onClick={() => setActiveSubTab('transfer')}
            className={`py-2 px-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
              activeSubTab === 'transfer'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Transfer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('alert')}
            className={`py-2 px-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1 shrink-0 ${
              activeSubTab === 'alert'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Alert</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* TAB 1: TRAJECTORY & CHART */}
          {activeSubTab === 'trajectory' && (
            <div className="space-y-6">
              {/* Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Current Stock</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {formatNumber(drug.currentStock)} {drug.unit}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium mt-1">
                    {formatCurrencyKzt(drug.currentStock * drug.unitCostKzt)}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Daily Consumption</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {formatNumber(drug.dailyConsumption)} {drug.unit}
                  </div>
                  <div className="text-[11px] text-red-600 font-semibold mt-1">
                    +{drug.consumptionTrendPercent}% demand trend
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Depletion in</div>
                  <div className={`text-lg font-bold font-mono mt-0.5 ${
                    drug.burnoutDays < 15 ? 'text-red-600' : 'text-blue-700'
                  }`}>
                    {drug.burnoutDays} days
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    Critical threshold: 20d
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium">Delivery in</div>
                  <div className="text-lg font-bold text-slate-900 font-mono mt-0.5">
                    {drug.nextDeliveryDays} days
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 font-mono">
                    +{formatNumber(drug.nextDeliveryQty)} {drug.unit}
                  </div>
                </div>
              </div>

              {/* Deficit Alert Warning Box */}
              {drug.nextDeliveryDays > drug.burnoutDays ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-900 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-red-800">
                      Projected deficit gap detected: {drug.nextDeliveryDays - drug.burnoutDays} days!
                    </h4>
                    <p className="text-xs text-red-700 mt-1 leading-relaxed">
                      Stock will be completely exhausted on day {drug.burnoutDays}, while the shipment from {drug.supplier} arrives on day {drug.nextDeliveryDays}.
                      Inter-regional rebalancing or emergency allocation from the KZ MoH reserve fund is recommended.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-emerald-800">
                      Stable Supply Chain
                    </h4>
                    <p className="text-xs text-emerald-700 mt-1">
                      Scheduled delivery will arrive on time before critical stock exhaustion.
                    </p>
                  </div>
                </div>
              )}

              {/* 45-day Trajectory SVG Chart */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <span>45-Day Stock Simulation</span>
                    <span className="text-xs font-normal text-slate-500 font-mono">
                      (Stock vs Burn Rate vs Delivery)
                    </span>
                  </h4>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="flex items-center gap-1.5 text-blue-700 font-medium">
                      <span className="w-3 h-0.5 bg-blue-600"></span> Stock trajectory
                    </span>
                    <span className="flex items-center gap-1.5 text-red-600 font-medium">
                      <span className="w-3 h-0.5 bg-red-500 border-b border-dashed"></span> Stockout point (Deficit)
                    </span>
                    <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Distributor delivery
                    </span>
                  </div>
                </div>

                {/* SVG Line Chart */}
                <div className="w-full h-56 relative bg-white rounded-lg p-2 border border-slate-200">
                  <svg className="w-full h-full" viewBox="0 0 500 200" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="50" x2="500" y2="50" stroke="#E2E8F0" strokeWidth="1" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#E2E8F0" strokeWidth="1" />
                    <line x1="0" y1="150" x2="500" y2="150" stroke="#E2E8F0" strokeWidth="1" />
                    <line x1="0" y1="180" x2="500" y2="180" stroke="#CBD5E1" strokeWidth="1.5" />

                    {/* Stock depletion curve */}
                    <polyline
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="2.5"
                      points={points
                        .map((p) => {
                          const x = (p.day / daysHorizon) * 480 + 10;
                          const y = 180 - (p.stock / maxStock) * 160;
                          return `${x},${Math.max(10, Math.min(180, y))}`;
                        })
                        .join(' ')}
                    />

                    {/* Delivery Point Dot */}
                    {drug.nextDeliveryDays <= daysHorizon && (
                      <g>
                        <circle
                          cx={(drug.nextDeliveryDays / daysHorizon) * 480 + 10}
                          cy={180 - ((points[drug.nextDeliveryDays]?.stock || 0) / maxStock) * 160}
                          r="5"
                          fill="#10B981"
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <text
                          x={(drug.nextDeliveryDays / daysHorizon) * 480 + 15}
                          y={180 - ((points[drug.nextDeliveryDays]?.stock || 0) / maxStock) * 160 - 8}
                          fontSize="9"
                          fill="#047857"
                          fontWeight="bold"
                        >
                          +{formatNumber(drug.nextDeliveryQty)}
                        </text>
                      </g>
                    )}

                    {/* Zero Burnout Marker */}
                    {drug.burnoutDays <= daysHorizon && (
                      <g>
                        <line
                          x1={(drug.burnoutDays / daysHorizon) * 480 + 10}
                          y1="20"
                          x2={(drug.burnoutDays / daysHorizon) * 480 + 10}
                          y2="180"
                          stroke="#EF4444"
                          strokeWidth="1.5"
                          strokeDasharray="4 2"
                        />
                        <text
                          x={(drug.burnoutDays / daysHorizon) * 480 + 12}
                          y="30"
                          fontSize="9"
                          fill="#DC2626"
                          fontWeight="bold"
                        >
                          Depletion (Day {drug.burnoutDays})
                        </text>
                      </g>
                    )}
                  </svg>
                </div>

                {/* X Axis Timeline Marks */}
                <div className="flex justify-between text-[11px] text-slate-500 font-mono px-2">
                  <span>Today (0d)</span>
                  <span>10d</span>
                  <span>20d</span>
                  <span>30d</span>
                  <span>45d</span>
                </div>
              </div>

              {/* Substitutes / Analogues by INN */}
              <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Therapeutic INN Substitutes (for polyclinics & inpatient care)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {drug.prescriptionSubstitutes.map((sub, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-white rounded-lg text-xs font-semibold text-blue-800 border border-blue-200 shadow-2xs">
                      {sub}
                    </span>
                  ))}
                  <span className="text-xs text-slate-500 self-center ml-2">
                    Available for emergency substitution under KZ Ministry of Health clinical guidelines
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REGIONAL BREAKDOWN */}
          {activeSubTab === 'regions' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Stock distribution across regional warehouses and healthcare facilities:
              </p>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden bg-white">
                {drug.regionalDistribution.map((reg, idx) => (
                  <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{reg.region}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRiskBadgeClass(reg.risk)}`}>
                          {reg.risk === 'critical' ? 'Deficit (< 15d)' :
                           reg.risk === 'warning' ? 'Warning (15-30d)' :
                           reg.risk === 'normal' ? 'Normal' : 'Surplus'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-mono">
                        Burn rate: {reg.dailyBurn} {drug.unit} / day
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right font-mono">
                        <div className="text-sm font-bold text-slate-900">
                          {formatNumber(reg.stock)} {drug.unit}
                        </div>
                        <div className={`text-xs font-semibold ${
                          reg.risk === 'critical' ? 'text-red-600' : 'text-slate-500'
                        }`}>
                          Coverage: {reg.daysRemaining} days
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setTransferTo(reg.region);
                          setActiveSubTab('transfer');
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shrink-0"
                      >
                        Transfer here
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: INTER-REGIONAL TRANSFER */}
          {activeSubTab === 'transfer' && (
            <div className="space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-blue-600" />
                  Inter-Regional Stock Rebalancing
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Reallocating surplus inventory from well-stocked hubs to at-risk regions closes the deficit gap without unbudgeted spending from emergency reserves (21B ₸).
                </p>
              </div>

              {transferSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Success: Inter-regional transfer order dispatched in SK-Pharmacy logistics system!
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Source warehouse (surplus region):
                  </label>
                  <select
                    value={transferFrom}
                    onChange={(e) => setTransferFrom(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    {drug.regionalDistribution.map((r) => (
                      <option key={r.region} value={r.region}>
                        {r.region} (Stock: {formatNumber(r.stock)} {drug.unit}, {r.daysRemaining}d coverage)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Destination warehouse (deficit region):
                  </label>
                  <select
                    value={transferTo}
                    onChange={(e) => setTransferTo(e.target.value)}
                    className="w-full text-sm bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:ring-2 focus:ring-blue-500"
                  >
                    {drug.regionalDistribution.map((r) => (
                      <option key={r.region} value={r.region}>
                        {r.region} (Stock: {formatNumber(r.stock)} {drug.unit}, {r.daysRemaining}d coverage)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Transfer Quantity ({drug.unit}):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                    min={100}
                    step={100}
                    className="w-48 text-sm font-mono bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900"
                  />
                  <span className="text-xs text-slate-500">
                    Valued at: ~{formatCurrencyKzt(transferAmount * drug.unitCostKzt)}
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleExecuteTransfer}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <Truck className="w-4 h-4" />
                  Generate Transport Waybill
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ALERT DISPATCH */}
          {activeSubTab === 'alert' && (
            <div className="space-y-5 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Send className="w-5 h-5 text-blue-600" />
                  Automated Logistics & Pharmacy Alert
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Instant notification sent to SK-Pharmacy logistics dispatch and regional retail networks to activate safety stock reserves.
                </p>
              </div>

              {alertSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Alert successfully transmitted to logistics dispatch gateway!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Notification Recipient:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAlertTarget('sk_pharmacy')}
                    className={`p-3 rounded-lg text-left text-xs font-semibold border transition-all ${
                      alertTarget === 'sk_pharmacy'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    SK-Pharmacy (National Distributor)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertTarget('pharmacy_chain')}
                    className={`p-3 rounded-lg text-left text-xs font-semibold border transition-all ${
                      alertTarget === 'pharmacy_chain'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Retail Pharmacy Chains (Europharma, Biosphere)
                  </button>

                  <button
                    type="button"
                    onClick={() => setAlertTarget('hospital_inpatient')}
                    className={`p-3 rounded-lg text-left text-xs font-semibold border transition-all ${
                      alertTarget === 'hospital_inpatient'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    Inpatient Hospitals & Polyclinics
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Operational Dispatch Notice:
                </label>
                <textarea
                  rows={4}
                  value={alertNote}
                  onChange={(e) => setAlertNote(e.target.value)}
                  className="w-full text-sm bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <button
                  onClick={handleExecuteAlert}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Transmit Notice to Logistics Gateway
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">
            ID: {drug.id} • Updated {drug.lastUpdated}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
