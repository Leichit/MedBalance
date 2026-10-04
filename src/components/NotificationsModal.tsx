import React, { useState } from 'react';
import { LogisticsAlert } from '../types';
import { 
  X, 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Truck, 
  Building2, 
  Send,
  Filter
} from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: LogisticsAlert[];
  onUpdateAlertStatus: (alertId: string, newStatus: LogisticsAlert['status']) => void;
  onQuickDispatch?: (alert: LogisticsAlert) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onUpdateAlertStatus,
  onQuickDispatch,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_transit' | 'resolved'>('all');

  if (!isOpen) return null;

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === 'all') return true;
    return alert.status === filter;
  });

  const pendingCount = alerts.filter((a) => a.status === 'pending').length;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-xs p-0 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-t-3xl sm:rounded-2xl max-w-md w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in slide-in-from-bottom-5 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/70 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Notifications</h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
                    {pendingCount} active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">Logistics, inpatient hospitals & pharmacy networks</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'pending'
                ? 'bg-red-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Action Required ({alerts.filter((a) => a.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('in_transit')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'in_transit'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            In Transit ({alerts.filter((a) => a.status === 'in_transit' || a.status === 'dispatched').length})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === 'resolved'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            Resolved ({alerts.filter((a) => a.status === 'resolved').length})
          </button>
        </div>

        {/* Alerts List */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 divide-y divide-slate-100">
          {filteredAlerts.length === 0 ? (
            <div className="py-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <p className="text-sm font-semibold text-slate-800">All orders fulfilled</p>
              <p className="text-xs text-slate-500 mt-0.5">No active alerts in this category</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div 
                key={alert.id} 
                className="pt-3 first:pt-0 pb-1 rounded-xl transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        alert.severity === 'high'
                          ? 'bg-red-100 text-red-700'
                          : alert.severity === 'medium'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {alert.severity === 'high' ? 'Critical' : alert.severity === 'medium' ? 'Warning' : 'Info'}
                    </span>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                  </div>
                  
                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      alert.status === 'resolved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : alert.status === 'in_transit' || alert.status === 'dispatched'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                    }`}
                  >
                    {alert.status === 'resolved'
                      ? '✓ Resolved'
                      : alert.status === 'in_transit'
                      ? 'In Transit'
                      : alert.status === 'dispatched'
                      ? 'Dispatched'
                      : 'Needs Dispatch'}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug">
                  {alert.title}
                </h4>

                <div className="flex items-center gap-1 text-[11px] text-blue-700 font-medium mt-1">
                  <Building2 className="w-3.5 h-3.5 shrink-0 text-blue-500" />
                  <span className="truncate">{alert.targetName}</span>
                </div>

                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {alert.message}
                </p>

                {alert.recommendedAction && (
                  <div className="mt-2 text-[11px] text-slate-700 flex items-start gap-1.5">
                    <span className="font-bold text-slate-900 shrink-0">Action:</span>
                    <span className="text-slate-600">{alert.recommendedAction}</span>
                  </div>
                )}

                {/* Quick Action Buttons */}
                {alert.status !== 'resolved' && (
                  <div className="mt-3 flex items-center gap-2">
                    {alert.status === 'pending' && (
                      <button
                        onClick={() => {
                          onUpdateAlertStatus(alert.id, 'in_transit');
                          if (onQuickDispatch) onQuickDispatch(alert);
                        }}
                        className="flex-1 py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        Confirm & Dispatch Shipment
                      </button>
                    )}

                    {(alert.status === 'in_transit' || alert.status === 'dispatched') && (
                      <button
                        onClick={() => onUpdateAlertStatus(alert.id, 'resolved')}
                        className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Confirm Batch Receipt
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
