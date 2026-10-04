import React, { useState } from 'react';
import { 
  Truck, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Clock, 
  ArrowRightLeft, 
  Filter, 
  BellRing,
  Radio,
  Plus
} from 'lucide-react';
import { LogisticsAlert, DrugItem } from '../types';

interface LogisticsHubProps {
  alerts: LogisticsAlert[];
  drugs: DrugItem[];
  onUpdateAlertStatus: (alertId: string, newStatus: LogisticsAlert['status']) => void;
  onSendNewAlert: (alert: Omit<LogisticsAlert, 'id' | 'timestamp'>) => void;
  onAutoRebalance: () => void;
}

export const LogisticsHub: React.FC<LogisticsHubProps> = ({
  alerts,
  drugs,
  onUpdateAlertStatus,
  onSendNewAlert,
  onAutoRebalance,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | LogisticsAlert['status']>('all');
  const [showNewAlertForm, setShowNewAlertForm] = useState(false);

  // Form state
  const [newAlertDrugId, setNewAlertDrugId] = useState(drugs[0]?.id || '');
  const [newTargetType, setNewTargetType] = useState<LogisticsAlert['targetType']>('sk_pharmacy');
  const [newTargetName, setNewTargetName] = useState('SK-Pharmacy Logistics Hub');
  const [newTitle, setNewTitle] = useState('Proactive Reallocation of Pharmaceutical Reserve');
  const [newMessage, setNewMessage] = useState('Expedite delivery schedule due to forecasted surge in regional consumption.');
  const [newRecommendedAction, setNewRecommendedAction] = useState('Dispatch express consignment of 10,000 units.');

  const filteredAlerts = alerts.filter((alert) => {
    return filterStatus === 'all' || alert.status === filterStatus;
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const drug = drugs.find((d) => d.id === newAlertDrugId);
    onSendNewAlert({
      drugId: newAlertDrugId,
      drugName: drug ? drug.name : 'Medication',
      targetType: newTargetType,
      targetName: newTargetName,
      title: newTitle,
      message: newMessage,
      severity: 'high',
      status: 'pending',
      recommendedAction: newRecommendedAction,
      estimatedTransitTimeDays: 2,
    });
    setShowNewAlertForm(false);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* 1. Coordination Status Card */}
      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600" />
            <h3 className="font-extrabold text-sm text-slate-900">
              SK-Pharmacy Logistics Hub
            </h3>
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Gateway Active
          </span>
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          Automated deficit transmission to Single Distributor hubs, hospital warehouses, and retail pharmacy chains (Europharma, Biosphere).
        </p>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={onAutoRebalance}
            className="w-full py-2 px-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/80 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>Auto-Balance</span>
          </button>

          <button
            onClick={() => setShowNewAlertForm(true)}
            className="w-full py-2 px-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Dispatch</span>
          </button>
        </div>
      </div>

      {/* 2. Status Filter & Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
          Alerts & Dispatches ({filteredAlerts.length})
        </span>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="text-xs bg-white border border-slate-200 text-slate-800 rounded-xl px-2.5 py-1 focus:outline-hidden"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="dispatched">Dispatched</option>
          <option value="in_transit">In Transit</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      {/* 3. Alerts Feed Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-xs text-slate-500">
            No active alerts
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-2.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-amber-100 text-amber-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity === 'high' ? 'Critical' : 'Warning'}
                  </span>
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-lg truncate max-w-[150px]">
                    {alert.drugName}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {alert.timestamp}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-slate-900">{alert.title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{alert.message}</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] border border-slate-100 space-y-1">
                <div className="text-slate-500">
                  Recipient: <strong className="text-slate-800">{alert.targetName}</strong>
                </div>
                <div className="text-blue-900 font-medium">
                  Directive: <span className="text-slate-700">{alert.recommendedAction}</span>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className={`px-2 py-0.5 rounded-lg font-bold text-[10px] ${
                  alert.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  alert.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                  alert.status === 'in_transit' ? 'bg-purple-100 text-purple-800' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {alert.status === 'pending' ? 'Pending' :
                   alert.status === 'dispatched' ? 'Dispatched' :
                   alert.status === 'in_transit' ? `In Transit (~${alert.estimatedTransitTimeDays}d)` :
                   'Delivered'}
                </span>

                <div className="flex items-center gap-1.5">
                  {alert.status === 'pending' && (
                    <button
                      onClick={() => onUpdateAlertStatus(alert.id, 'dispatched')}
                      className="px-2.5 py-1 text-[11px] font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Dispatch
                    </button>
                  )}
                  {alert.status === 'dispatched' && (
                    <button
                      onClick={() => onUpdateAlertStatus(alert.id, 'in_transit')}
                      className="px-2.5 py-1 text-[11px] font-bold bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      To Transit
                    </button>
                  )}
                  {alert.status === 'in_transit' && (
                    <button
                      onClick={() => onUpdateAlertStatus(alert.id, 'resolved')}
                      className="px-2.5 py-1 text-[11px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                    >
                      Acknowledge
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 4. Connected Logistics Hubs & Retail Networks */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3">
        <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5 text-blue-600" />
          Single Distributor SK-Pharmacy Hubs
        </h4>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Northern Hub (Astana)</span>
              <span className="text-emerald-700 font-mono text-[10px]">Nominal</span>
            </div>
            <span className="text-[10px] text-slate-500">Unloading batches: 14 • In transit: 8</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Southern Hub (Almaty & Shymkent)</span>
              <span className="text-emerald-700 font-mono text-[10px]">Nominal</span>
            </div>
            <span className="text-[10px] text-slate-500">Unloading batches: 22 • In transit: 15</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center justify-between font-bold text-slate-800">
              <span>Western Hub (Aktobe)</span>
              <span className="text-emerald-700 font-mono text-[10px]">Nominal</span>
            </div>
            <span className="text-[10px] text-slate-500">Unloading batches: 9 • In transit: 4</span>
          </div>
        </div>
      </div>

      {/* Modal: New Alert Form */}
      {showNewAlertForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900">Create Logistics Dispatch</h3>
              <button
                onClick={() => setShowNewAlertForm(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAlert} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medication:</label>
                <select
                  value={newAlertDrugId}
                  onChange={(e) => setNewAlertDrugId(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                >
                  {drugs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.burnoutDays}d remaining)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recipient:</label>
                <select
                  value={newTargetType}
                  onChange={(e) => setNewTargetType(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                >
                  <option value="sk_pharmacy">Single Distributor "SK-Pharmacy"</option>
                  <option value="pharmacy_chain">Pharmacy Chains (Europharma, Biosphere)</option>
                  <option value="hospital_inpatient">Inpatient Hospitals</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message:</label>
                <textarea
                  rows={2}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewAlertForm(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Dispatch to Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
