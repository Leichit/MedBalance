import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Layers, 
  RefreshCw, 
  Copy, 
  Check, 
  ShieldAlert,
  Building2,
  TrendingDown
} from 'lucide-react';
import { DrugItem, AIAnalysisResult } from '../types';

interface AiStrategicAdvisorProps {
  drugs: DrugItem[];
  selectedRegion: string;
  onClose?: () => void;
}

export const AiStrategicAdvisor: React.FC<AiStrategicAdvisorProps> = ({
  drugs,
  selectedRegion,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [scenarioNotes, setScenarioNotes] = useState(
    'Factor in seasonal ARVI surge and urgent hospital requests (8.5B ₸ in August and 4.4B ₸ in November).'
  );

  const runAiAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      // Prepare compact representation of critical and warning items
      const simplifiedItems = drugs.map((d) => ({
        name: d.name,
        category: d.category,
        stock: d.currentStock,
        dailyConsumption: d.dailyConsumption,
        burnoutDays: d.burnoutDays,
        nextDeliveryDays: d.nextDeliveryDays,
        supplier: d.supplier,
        risk: d.riskLevel,
      }));

      const res = await fetch('/api/ai/predict-deficit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: simplifiedItems,
          selectedRegion,
          scenario: 'Deficit Risk Assessment and Reserve Reallocation',
          notes: scenarioNotes,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysis(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to retrieve AI analysis');
      }
    } catch (err: any) {
      setError(err.message || 'AI service connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!analysis) return;
    const textToCopy = `MEDBALANCE PREDICTIVE SYSTEM REPORT (DIGITAL QAZAQSTAN / MINISTRY OF HEALTH)\n
EXECUTIVE SUMMARY:
${analysis.summary}

DEFICIT RISK INDEX: ${analysis.riskScore}/100

URGENT ACTIONS:
${analysis.urgentActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

21B ₸ EMERGENCY RESERVE RECOMMENDATION:
${analysis.reserveFundAllocation}

LOGISTICS & RETAIL PHARMACIES:
${analysis.logisticsRecommendations.map((r, i) => `• ${r}`).join('\n')}

INTER-REGIONAL BALANCING:
${analysis.reallocationProposal}
    `;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-4 pb-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-2xs space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
                KZ MoH AI Strategic Advisor
              </h2>
              <span className="text-[10px] text-blue-700 font-semibold font-mono">
                Gemini 3.8 Flash • Digital Qazaqstan
              </span>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
            >
              ✕
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-600 leading-relaxed">
          Automated shortage detection, stockout horizon calculations prior to SK-Pharmacy transit arrivals, and 21B ₸ reserve fund optimization.
        </p>

        <button
          onClick={runAiAnalysis}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Generating Forecast...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Predictive AI Analysis</span>
            </>
          )}
        </button>
      </div>

      {/* Configuration & Context input */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          Neural Forecast Prompt Parameters:
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={scenarioNotes}
            onChange={(e) => setScenarioNotes(e.target.value)}
            className="flex-1 text-xs bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            placeholder="Context (seasonal trends, customs bottlenecks, critical positions)..."
          />
          <button
            onClick={runAiAnalysis}
            disabled={loading}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors shrink-0"
          >
            Update Report
          </button>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Analysis Result Box */}
      {analysis && (
        <div className="bg-white rounded-xl border border-blue-200 shadow-sm p-6 space-y-6">
          {/* Top Bar with Risk Score */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                Predictive Simulation Results
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Strategic Brief for the Ministry of Health of RK
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <span className="text-xs font-medium text-slate-600">Deficit Risk Index:</span>
                <span className={`text-base font-extrabold font-mono ${
                  analysis.riskScore > 70 ? 'text-red-600' : 'text-amber-600'
                }`}>
                  {analysis.riskScore} / 100
                </span>
              </div>

              <button
                onClick={handleCopyReport}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                title="Copy report for protocol"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-1 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-blue-700" />
              Executive Situation Summary
            </h4>
            <p className="text-sm text-blue-950 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Grid: Urgent Actions & Reserve Fund Allocation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Urgent Actions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                Urgent Remedial Actions:
              </h4>
              <ul className="space-y-2">
                {analysis.urgentActions.map((act, i) => (
                  <li key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{act}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Reserve Fund Recommendation */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-700" />
                Reserve Fund Allocation (21B ₸):
              </h4>
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                <p className="text-slate-800 leading-relaxed font-medium">
                  {analysis.reserveFundAllocation}
                </p>
                <div className="pt-2 border-t border-slate-200 text-slate-500 text-[11px]">
                  Objective: prevent recurrence of unplanned supply shortages of August (8.5B ₸) and November (4.4B ₸) through proactive procurement.
                </div>
              </div>
            </div>
          </div>

          {/* Logistics & Inter-regional Rebalance */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Directives for SK-Pharmacy Logistics Hubs:
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {analysis.logisticsRecommendations.map((rec, i) => (
                  <li key={i} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Inter-regional Stock Rebalancing:
              </h4>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-800 leading-relaxed">
                {analysis.reallocationProposal}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Initial Callout if no analysis run yet */}
      {!analysis && !loading && (
        <div className="bg-white rounded-xl border border-dashed border-blue-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Ready to Generate Predictive Forecast
          </h3>
          <p className="text-xs text-slate-600 max-w-lg mx-auto">
            Click "Run Predictive AI Analysis" to process current inventory levels, 
            daily consumption rates, and transit schedules to uncover latent deficit risks.
          </p>
          <button
            onClick={runAiAnalysis}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            Generate Report
          </button>
        </div>
      )}
    </div>
  );
};
