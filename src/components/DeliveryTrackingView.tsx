import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Package, 
  ShieldCheck, 
  Thermometer, 
  Info, 
  RefreshCw,
  ArrowRight,
  RotateCcw,
  Building2,
  Calendar
} from 'lucide-react';
import { DemoShipment } from '../data/demoScenarioData';
import { formatNumber } from '../utils/formatters';

interface DeliveryTrackingViewProps {
  shipment: DemoShipment;
  onUpdateStatus: (newStatus: DemoShipment['status']) => void;
  onAdvanceProgress: (progress: number) => void;
  onSimulateDelay: () => void;
  onResetShipment: () => void;
  onProceedToWarehouse: () => void;
}

export const DeliveryTrackingView: React.FC<DeliveryTrackingViewProps> = ({
  shipment,
  onUpdateStatus,
  onAdvanceProgress,
  onSimulateDelay,
  onResetShipment,
  onProceedToWarehouse,
}) => {
  const [gpsUnavailable, setGpsUnavailable] = useState<boolean>(false);

  // Status index for timeline
  const statuses: { key: DemoShipment['status']; label: string; sub: string }[] = [
    { key: 'awaiting_confirmation', label: 'Awaiting Confirmation', sub: 'Supplier portal' },
    { key: 'confirmed', label: 'Confirmed', sub: 'Demo Supplier B' },
    { key: 'dispatched', label: 'Dispatched', sub: 'Warehouse departure' },
    { key: 'in_transit', label: 'In Transit', sub: 'Corridor to Astana' },
    { key: 'arrived', label: 'Arrived', sub: 'Hospital gate' },
    { key: 'received', label: 'Received', sub: 'Warehouse intake' },
  ];

  const currentStatusIndex = statuses.findIndex((s) => s.key === shipment.status);

  // Stock burnout day reference (Day 17.1 is stockout without delivery; Day 12 is scheduled arrival)
  const isDelayCritical = shipment.isDelayed && shipment.etaDays >= 17;

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {shipment.shipmentId}
              </span>
              <span className="text-xs text-slate-500 font-mono">PO: {shipment.orderId}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900 mt-1">Live Shipment Tracking</h2>
            <p className="text-xs text-slate-500">Astana Demo Hospital logistics supply line</p>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
              shipment.status === 'arrived' 
                ? 'bg-amber-100 text-amber-900 border border-amber-200' 
                : shipment.status === 'in_transit'
                ? 'bg-blue-100 text-blue-900 border border-blue-200'
                : shipment.status === 'received'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                : 'bg-slate-100 text-slate-700'
            }`}>
              <Truck className="w-3.5 h-3.5" />
              {shipment.status === 'in_transit' ? 'In Transit' :
               shipment.status === 'arrived' ? 'Arrived at Gate' :
               shipment.status === 'confirmed' ? 'Confirmed by Supplier' :
               shipment.status === 'dispatched' ? 'Dispatched from Hub' :
               shipment.status === 'received' ? 'Intake Complete' : 'Awaiting Confirmation'}
            </span>
            <div className="text-[10px] text-slate-400 mt-1">
              Updated: {gpsUnavailable ? 'Location Unavailable' : shipment.lastUpdated}
            </div>
          </div>
        </div>

        {/* Carrier & Shipment Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5 pt-3 border-t border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px]">Carrier:</span>
            <span className="font-semibold text-slate-800">{shipment.carrier}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Item & Batch:</span>
            <span className="font-semibold text-slate-800">{formatNumber(shipment.packsCount)} packs ({shipment.lotNumber})</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Cold-Chain Sensor:</span>
            <span className="font-semibold text-emerald-700 flex items-center gap-1">
              <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
              {shipment.temperatureColdChain}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">ETA Schedule:</span>
            <span className={`font-bold ${shipment.isDelayed ? 'text-amber-700' : 'text-slate-800'}`}>
              Day {shipment.etaDays} {shipment.isDelayed && '(Delayed +2d)'}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Stock Alert if Delayed */}
      {shipment.isDelayed && (
        <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
          isDelayCritical ? 'bg-red-50 border-red-300 text-red-900' : 'bg-amber-50 border-amber-300 text-amber-900'
        }`}>
          <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${isDelayCritical ? 'text-red-600' : 'text-amber-600'}`} />
          <div className="text-xs space-y-1">
            <div className="font-bold">
              {isDelayCritical 
                ? 'CRITICAL WARNING: Delay threatens stock depletion!' 
                : 'Transit Delay Notice: Rescheduled ETA to Day 14'}
            </div>
            <p className="text-[11px] leading-relaxed">
              {shipment.delayReason || 'Inclement weather on North-Central highway corridor. Driver in contact with logistics coordinator.'}
              {isDelayCritical 
                ? ' Warning: Current reserve of DEMO-M01 covers only 17.1 days. Urgent buffer check required.' 
                : ' Safety stock of 25 packs covers variance. No immediate clinical deficit.'}
            </p>
          </div>
        </div>
      )}

      {/* Map & Corridor Simulation Box */}
      <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-400 animate-pulse" />
            <span className="text-xs font-bold tracking-tight">Logistics Route & GPS Telemetry</span>
          </div>
          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-mono">
            Simulated Tracking
          </span>
        </div>

        {/* Visual Simulated Route Diagram */}
        <div className="relative py-7 my-2">
          {/* Background highway line */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1.5 bg-slate-700/80 rounded-full" />
          
          {/* Progress bar line */}
          <div 
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1.5 bg-blue-500 rounded-full transition-all duration-500" 
            style={{ width: `calc(${shipment.progressPercent}% * 0.88)` }}
          />

          <div className="relative flex items-center justify-between">
            {/* Origin: Supplier Depot */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-slate-800 border-2 border-blue-400 flex items-center justify-center shadow-md">
                <Building2 className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-200">Demo Supplier B</span>
              <span className="text-[9px] text-slate-400">Karaganda Depot</span>
            </div>

            {/* Moving Vehicle Marker */}
            <div 
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
              style={{ left: `calc(12% + ${shipment.progressPercent * 0.76}%)` }}
            >
              <div className="relative group">
                <div className="w-9 h-9 rounded-xl bg-blue-600 border-2 border-white flex items-center justify-center shadow-xl animate-bounce">
                  <Truck className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-800 text-[9px] px-2 py-0.5 rounded border border-slate-700 font-mono shadow-xs">
                  {shipment.progressPercent}% of Route
                </div>
              </div>
            </div>

            {/* Destination: Astana Demo Hospital */}
            <div className="flex flex-col items-center">
              <div className="w-9 h-9 rounded-full bg-emerald-950 border-2 border-emerald-400 flex items-center justify-center shadow-md">
                <MapPin className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="text-[10px] font-bold mt-1 text-slate-200">Astana Demo Hosp.</span>
              <span className="text-[9px] text-emerald-400">KZ-DEMO-01</span>
            </div>
          </div>
        </div>

        {/* Live Metrics footer */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[9px]">Driver & Plate:</span>
            <span className="font-mono text-slate-200 truncate block">Demo Logistics · 104 KZ 01</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px]">Speed & Heading:</span>
            <span className="font-mono text-slate-200">
              {shipment.status === 'arrived' ? '0 km/h (Docked)' : shipment.status === 'in_transit' ? '74 km/h · NW' : 'Stationary'}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px]">Estimated Arrival:</span>
            <span className="font-bold text-blue-400">
              {shipment.status === 'arrived' ? 'Gate Check' : `Day ${shipment.etaDays} (14:30)`}
            </span>
          </div>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Delivery Status Progression
        </h3>
        <div className="space-y-2">
          {statuses.map((s, idx) => {
            const isCompleted = idx < currentStatusIndex;
            const isCurrent = idx === currentStatusIndex;
            return (
              <div key={s.key} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                  isCompleted 
                    ? 'bg-emerald-600 text-white' 
                    : isCurrent 
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse' 
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}>
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <div className="flex-1 flex items-center justify-between text-xs">
                  <div>
                    <span className={`font-semibold ${isCurrent ? 'text-blue-600 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-2">({s.sub})</span>
                  </div>
                  {isCompleted && <span className="text-[10px] text-emerald-600 font-medium">Completed</span>}
                  {isCurrent && <span className="text-[10px] text-blue-600 font-bold">Active</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Vital Rule Disclaimer as requested in brief */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong>Audit & Stock Rule:</strong> Arrival of the transport vehicle does <em>not</em> increase warehouse stock. Stock balances update only after physical intake scanning and inspection in the mobile warehouse module.
          </span>
        </div>
      </div>

      {/* Defense Interactive Simulation Controls */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            Midterm Defense Simulation Controls
          </span>
          <button 
            onClick={onResetShipment}
            className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Shipment
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => onUpdateStatus('confirmed')}
            className={`py-2 px-2.5 rounded-xl font-semibold border transition-all ${
              shipment.status === 'confirmed' 
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            1. Confirm Order
          </button>

          <button
            onClick={() => {
              onUpdateStatus('dispatched');
              onAdvanceProgress(15);
            }}
            className={`py-2 px-2.5 rounded-xl font-semibold border transition-all ${
              shipment.status === 'dispatched' 
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            2. Dispatch Batch
          </button>

          <button
            onClick={() => {
              onUpdateStatus('in_transit');
              onAdvanceProgress(Math.min(85, shipment.progressPercent + 35));
            }}
            className={`py-2 px-2.5 rounded-xl font-semibold border transition-all ${
              shipment.status === 'in_transit' 
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            3. Advance Delivery
          </button>

          <button
            onClick={() => {
              onUpdateStatus('arrived');
              onAdvanceProgress(100);
            }}
            className={`py-2 px-2.5 rounded-xl font-semibold border transition-all ${
              shipment.status === 'arrived' 
                ? 'bg-amber-600 text-white border-amber-700 shadow-xs' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            4. Mark Arrived at Gate
          </button>
        </div>

        {/* Separate Branch Buttons */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row gap-2">
          <button
            onClick={onSimulateDelay}
            className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            Simulate Weather Delay (+2 days)
          </button>

          <button
            onClick={() => setGpsUnavailable(!gpsUnavailable)}
            className="flex-1 bg-slate-200/80 hover:bg-slate-300 text-slate-800 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Clock className="w-3.5 h-3.5" />
            {gpsUnavailable ? 'Restore GPS Telemetry' : 'Simulate Lost Signal'}
          </button>
        </div>

        {/* Action Button to Proceed to Warehouse Receiving */}
        <button
          onClick={onProceedToWarehouse}
          className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
        >
          <Package className="w-4 h-4" />
          Proceed to Mobile Warehouse Intake (Receive 280 / 300)
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
