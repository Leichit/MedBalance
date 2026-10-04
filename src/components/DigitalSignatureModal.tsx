import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Key, 
  FileText, 
  Hash, 
  Database, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  AlertOctagon,
  ArrowRight,
  ShieldAlert,
  Unlock,
  Lock,
  Layers
} from 'lucide-react';
import { DemoRequisition } from '../data/demoScenarioData';
import { formatCurrencyKzt, formatNumber } from '../utils/formatters';

interface DigitalSignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  requisition: DemoRequisition;
  onConfirmSignature: () => void;
  onTamperDocument: () => void;
  onRestoreOriginal: () => void;
}

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({
  isOpen,
  onClose,
  requisition,
  onConfirmSignature,
  onTamperDocument,
  onRestoreOriginal,
}) => {
  const [activeStep, setActiveStep] = useState<number>(requisition.status === 'approved_signed' ? 5 : 1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  if (!isOpen) return null;

  const originalHash = "8e41bc720a45f9d6b2c9381ea8b3940173e1c62f928e4610d05c21980a37b120";
  const tamperedHash = "3f98c1192e44d852a091bf6682ad813351ec94103fa72bb580c80775d5e2e891";

  const currentDisplayHash = requisition.tampered ? tamperedHash : originalHash;
  const isSigned = requisition.status === 'approved_signed';
  const isFailed = requisition.tampered;

  const handleRunSignatureFlow = () => {
    setIsProcessing(true);
    setActiveStep(1);
    setTimeout(() => {
      setActiveStep(2);
      setTimeout(() => {
        setActiveStep(3);
        setTimeout(() => {
          setActiveStep(4);
          setTimeout(() => {
            setActiveStep(5);
            setIsProcessing(false);
            onConfirmSignature();
          }, 400);
        }, 400);
      }, 400);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      {/* Modal Container with exact theme from slide */}
      <div className="bg-[#0b1329] text-white rounded-2xl shadow-2xl border border-blue-900/40 w-full max-w-md overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="px-4 py-3.5 border-b border-blue-900/30 flex items-start justify-between bg-gradient-to-r from-[#0b1329] via-[#0f1d3d] to-[#0b1329]">
          <div>
            <div className="text-[10px] font-bold tracking-wider text-cyan-400 font-mono uppercase">
              MedBalance Security Architecture
            </div>
            <h2 className="text-base font-black tracking-tight text-white mt-0.5">
              Защита документов от изменений
            </h2>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Электронная подпись: создание, хранение и проверка
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-3.5 overflow-y-auto space-y-3.5 text-xs">
          
          {/* Active Requisition Metadata Ribbon */}
          <div className="bg-[#121c3b] border border-blue-900/50 rounded-xl p-2.5 space-y-1 text-slate-300">
            <div className="flex items-center justify-between">
              <span className="font-mono text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800 text-[10px]">
                {requisition.id} ({requisition.version})
              </span>
              <span className="text-[10px] text-cyan-300 font-semibold">
                {requisition.status === 'approved_signed' ? 'Подписан' : 'Ожидает подписи'}
              </span>
            </div>
            <div className="font-bold text-white text-xs truncate">
              {requisition.itemName}
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-blue-900/30">
              <span>Количество: <strong className={requisition.tampered ? "text-red-400 underline font-black" : "text-white"}>{formatNumber(requisition.orderedQty)} уп.</strong></span>
              <span>Подписант: <strong className="text-white">{requisition.approver}</strong></span>
            </div>
          </div>

          {/* 5-Step Visual Flow corresponding to slide diagram */}
          <div className="space-y-2">
            {/* 01 Документ */}
            <div className={`p-3 rounded-xl border transition-all ${
              activeStep >= 1 ? 'bg-[#14234b] border-cyan-500/60 shadow-md' : 'bg-[#0f1833] border-blue-950 text-slate-400'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span className="text-cyan-400 font-mono text-[10px] font-bold">01</span>
                  Документ
                </span>
                <span className="text-[10px] text-cyan-200 font-mono">REQ-DEMO-104</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Окончательная версия заявки или договора согласована сотрудником
              </p>
            </div>

            {/* 02 Хеш документа */}
            <div className={`p-3 rounded-xl border transition-all ${
              activeStep >= 2 ? 'bg-[#14234b] border-cyan-500/60 shadow-md' : 'bg-[#0f1833] border-blue-950 text-slate-400'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span className="text-cyan-400 font-mono text-[10px] font-bold">02</span>
                  Хеш документа (SHA-256)
                </span>
                <span className="text-[10px] text-cyan-200 font-mono">{currentDisplayHash.slice(0, 10)}...</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Вычисление цифрового отпечатка документа. Пример: SHA-256
              </p>
            </div>

            {/* 03 Электронная подпись */}
            <div className={`p-3 rounded-xl border transition-all ${
              activeStep >= 3 ? 'bg-[#14234b] border-cyan-500/60 shadow-md' : 'bg-[#0f1833] border-blue-950 text-slate-400'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span className="text-cyan-400 font-mono text-[10px] font-bold">03</span>
                  Электронная подпись
                </span>
                <span className="text-[10px] text-cyan-200">Demo Approver</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Уполномоченный сотрудник подписывает документ своим закрытым ключом
              </p>
            </div>

            {/* 04 Хранение */}
            <div className={`p-3 rounded-xl border transition-all ${
              activeStep >= 4 ? 'bg-[#14234b] border-cyan-500/60 shadow-md' : 'bg-[#0f1833] border-blue-950 text-slate-400'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span className="text-cyan-400 font-mono text-[10px] font-bold">04</span>
                  Хранение
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Secure Vault</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Документ + подпись + сертификат. ID документа и номер версии. База данных / хранилище файлов. Журнал действий сотрудников.
              </p>
            </div>

            {/* 05 Проверка */}
            <div className={`p-3 rounded-xl border transition-all ${
              activeStep >= 5 ? 'bg-[#14234b] border-cyan-500/60 shadow-md' : 'bg-[#0f1833] border-blue-950 text-slate-400'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <span className="text-cyan-400 font-mono text-[10px] font-bold">05</span>
                  Проверка
                </span>
                <span className="text-[10px] text-cyan-200">Public Key Verify</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                Система проверяет документ и подпись открытым ключом. Проверяет сертификат и полномочия подписанта.
              </p>
            </div>

            {/* Verification Outcomes (Green vs Red branches from slide) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Outcome A: Проверка успешна */}
              <div className={`p-2.5 rounded-xl border transition-all ${
                isSigned && !isFailed
                  ? 'bg-emerald-950/80 border-emerald-500 ring-2 ring-emerald-500/40 text-emerald-200'
                  : 'bg-[#0f1833]/60 border-slate-800 text-slate-500 opacity-60'
              }`}>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold text-white text-[11px]">Проверка успешна</span>
                </div>
                <p className="text-[10px] mt-1 text-slate-300 leading-snug">
                  Документ допускается к обработке
                </p>
              </div>

              {/* Outcome B: Проверка не пройдена */}
              <div className={`p-2.5 rounded-xl border transition-all ${
                isFailed
                  ? 'bg-red-950/90 border-red-500 ring-2 ring-red-500/50 text-red-200'
                  : 'bg-[#0f1833]/60 border-slate-800 text-slate-500 opacity-60'
              }`}>
                <div className="flex items-center gap-1.5">
                  <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0" />
                  <span className="font-bold text-white text-[11px]">Проверка не пройдена</span>
                </div>
                <p className="text-[10px] mt-1 text-slate-300 leading-snug">
                  Блокировка отправки и уведомление
                </p>
              </div>
            </div>
          </div>

          {/* Example Box from Slide (Пример: после подписания количество изменили с 300 на 1 000 упаковок) */}
          <div className="bg-[#121c3b] rounded-xl p-3.5 border border-blue-900/60 space-y-1.5">
            <div className="font-bold text-white text-xs flex items-center justify-between">
              <span>Пример: после подписания количество изменили с 300 на 1 000 упаковок</span>
              <span className="text-[10px] text-cyan-400 font-mono">Тест целостности</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Изменённый документ не пройдёт проверку исходной подписи. Вычисленный хеш не совпадёт с криптографическим отпечатком в сертификате. Новая версия требует повторного согласования и новой подписи.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2">
              {!requisition.tampered ? (
                <button
                  onClick={onTamperDocument}
                  className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  Simulate Document Change (300 ➔ 1 000 уп.)
                </button>
              ) : (
                <button
                  onClick={onRestoreOriginal}
                  className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Восстановить исходный подписанный документ (300 уп.)
                </button>
              )}
            </div>
          </div>

          {/* Slide Footer Principle Note */}
          <div className="text-[11px] text-slate-400 italic pt-1 border-t border-blue-900/30">
            Подпись помогает проверить целостность документа и подписанта; она не шифрует содержимое.
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="bg-[#0f1833] px-5 py-3 border-t border-blue-900/40 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-medium"
          >
            Закрыть
          </button>

          {requisition.status !== 'approved_signed' ? (
            <button
              onClick={handleRunSignatureFlow}
              disabled={isProcessing}
              className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 text-xs font-extrabold py-2 px-4 rounded-xl shadow-md flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Key className="w-4 h-4" />
              {isProcessing ? 'Формирование подписи...' : 'Подписать как Demo Approver'}
            </button>
          ) : requisition.tampered ? (
            <button
              disabled
              className="bg-red-950/80 text-red-300 border border-red-700/60 text-xs font-bold py-2 px-4 rounded-xl cursor-not-allowed flex items-center gap-2"
            >
              <AlertOctagon className="w-4 h-4 text-red-400" />
              Отправка заблокирована (нарушена целостность)
            </button>
          ) : (
            <button
              onClick={onClose}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl flex items-center gap-2 shadow-xs transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              Подпись проверена — Документ допущен
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
