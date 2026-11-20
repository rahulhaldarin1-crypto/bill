import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BookmarkCheck, Download, FilePlus2, Printer } from 'lucide-react';
import { InvoiceForm } from './components/InvoiceForm';
import { InvoicePreview } from './components/InvoicePreview';
import { SavedBillsView } from './components/SavedBillsView';
import { StoreSettingsView } from './components/StoreSettingsView';
import {
  createBlankInvoice,
  DEFAULT_STORE_SETTINGS,
  INITIAL_SAMPLE_INVOICE,
} from './data/defaults';
import { TRANSLATIONS } from './i18n/translations';
import { InvoiceData, Language, SavedInvoice, StoreSettings } from './types/invoice';
import {
  buildPdfFilename,
  calculateTotals,
  exportElementToPdf,
  incrementInvoiceNumber,
} from './utils/invoiceHelpers';

type ActiveTab = 'builder' | 'saved' | 'settings';
type ZoomMode = 'fit' | 0.75 | 1;

const STORAGE_KEYS = {
  SETTINGS: 'gg_invoice_store_settings_v1',
  SAVED_BILLS: 'gg_invoice_saved_bills_v2',
  DRAFT: 'gg_invoice_current_draft_v2',
  LANG: 'gg_invoice_ui_lang_v1',
};

function loadInitialSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(raw) };
  } catch {
    // ignore storage errors
  }
  return DEFAULT_STORE_SETTINGS;
}

function loadInitialSavedBills(): SavedInvoice[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_BILLS);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore storage errors
  }
  return [];
}

function loadInitialDraft(): InvoiceData {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore storage errors
  }
  return INITIAL_SAMPLE_INVOICE;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('builder');
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LANG);
      return saved === 'bn' ? 'bn' : 'en';
    } catch {
      return 'en';
    }
  });
  const [settings, setSettings] = useState<StoreSettings>(loadInitialSettings);
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>(loadInitialSavedBills);
  const [invoice, setInvoice] = useState<InvoiceData>(loadInitialDraft);

  const [zoomMode, setZoomMode] = useState<ZoomMode>('fit');
  const [fitScale, setFitScale] = useState<number>(0.78);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [pdfRenderTarget, setPdfRenderTarget] = useState<InvoiceData | null>(null);

  const previewStageRef = useRef<HTMLDivElement | null>(null);
  const invoiceSheetRef = useRef<HTMLDivElement | null>(null);
  const hiddenExportRef = useRef<HTMLDivElement | null>(null);

  const t = TRANSLATIONS[lang];

  // Persist draft, saved bills, settings, language
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(invoice));
    } catch {
      // ignore
    }
  }, [invoice]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SAVED_BILLS, JSON.stringify(savedInvoices));
    } catch {
      // ignore
    }
  }, [savedInvoices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LANG, lang);
    } catch {
      // ignore
    }
  }, [lang]);

  // Measure preview container to compute clean "Fit" scale for 794px A4 sheet
  useEffect(() => {
    const el = previewStageRef.current;
    if (!el) return;

    const updateScale = () => {
      const available = el.clientWidth - 32;
      if (available > 0) {
        const computed = Math.min(1, Math.max(0.36, available / 794));
        setFitScale(computed);
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeTab]);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((prev) => (prev === msg ? null : prev));
    }, 2600);
  }, []);

  const upsertSavedInvoice = useCallback((target: InvoiceData) => {
    const totals = calculateTotals(target);
    const entry: SavedInvoice = {
      ...target,
      grandTotal: totals.grandTotal,
      updatedAt: new Date().toISOString(),
    };
    setSavedInvoices((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === entry.id);
      if (existingIdx >= 0) {
        const clone = [...prev];
        clone[existingIdx] = entry;
        return clone;
      }
      return [entry, ...prev];
    });
  }, []);

  const handleSaveBill = () => {
    upsertSavedInvoice(invoice);
    showToast(t.billSavedToast);
  };

  const handleNewBill = () => {
    const latestInvNo = savedInvoices[0]?.meta.invoiceNo || invoice.meta.invoiceNo;
    const nextInvNo = latestInvNo ? incrementInvoiceNumber(latestInvNo) : '';
    setInvoice(createBlankInvoice(nextInvNo, settings));
    setActiveTab('builder');
  };

  const handleDownloadPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      upsertSavedInvoice(invoice);
      if (activeTab === 'builder' && invoiceSheetRef.current) {
        await exportElementToPdf(invoiceSheetRef.current, buildPdfFilename(invoice));
      } else {
        setPdfRenderTarget(invoice);
      }
    } catch (err) {
      console.error('PDF generation failed:', err);
      showToast('PDF export failed. Try using Print.');
    } finally {
      if (activeTab === 'builder') {
        setIsExporting(false);
      }
    }
  };

  // Trigger offscreen PDF export when triggered from Saved Bills or non-builder tab
  useEffect(() => {
    if (!pdfRenderTarget || !hiddenExportRef.current) return;
    let cancelled = false;
    const run = async () => {
      try {
        await exportElementToPdf(hiddenExportRef.current!, buildPdfFilename(pdfRenderTarget));
      } catch (err) {
        console.error('PDF export failed:', err);
      } finally {
        if (!cancelled) {
          setPdfRenderTarget(null);
          setIsExporting(false);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [pdfRenderTarget]);

  const handleDownloadSavedPdf = (saved: SavedInvoice) => {
    if (isExporting) return;
    setIsExporting(true);
    setPdfRenderTarget(saved);
  };

  const handleLoadSaved = (saved: SavedInvoice) => {
    const { grandTotal: _gt, ...rest } = saved;
    setInvoice(rest);
    setActiveTab('builder');
  };

  const handleDuplicateSaved = (saved: SavedInvoice) => {
    const { grandTotal: _gt, ...rest } = saved;
    const nextNo = incrementInvoiceNumber(saved.meta.invoiceNo);
    setInvoice({
      ...rest,
      id: `inv-${Date.now()}`,
      meta: {
        ...rest.meta,
        invoiceNo: nextNo,
      },
      updatedAt: new Date().toISOString(),
    });
    setActiveTab('builder');
  };

  const handleDeleteSaved = (id: string) => {
    setSavedInvoices((prev) => prev.filter((item) => item.id !== id));
  };

  const activeScale = zoomMode === 'fit' ? fitScale : zoomMode;

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F4EF] text-[#181613]">
      {/* TOP NAVIGATION BAR (Strict 3-zone contract) */}
      <header className="no-print sticky top-0 z-30 bg-[#FFFFFF]/95 backdrop-blur-xs border-b border-[#E4DFD4]">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line brand wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className="font-display-serif text-lg font-bold tracking-tight text-[#181613] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Glamour Galleria
          </button>

          {/* Zone 2: Clean single-line text nav links */}
          <nav className="flex items-center gap-6 overflow-x-auto">
            {(
              [
                { id: 'builder', label: t.navBuilder },
                { id: 'saved', label: `${t.navSaved} (${savedInvoices.length})` },
                { id: 'settings', label: t.navSettings },
              ] as const
            ).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1 text-sm font-medium transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                    isActive
                      ? 'text-[#181613] border-[#B8913D]'
                      : 'text-[#6B6356] border-transparent hover:text-[#181613]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single primary action button */}
          <div className="shrink-0">
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-2 rounded-md bg-[#181613] px-4 py-2 text-xs font-semibold text-[#F5EFE4] hover:bg-[#2E2923] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#D5AE52]" />
              <span>{isExporting ? t.downloadingPdf : t.downloadPdf}</span>
            </button>
          </div>
        </div>
      </header>

      {/* WORKSPACE TOOLBAR (Builder view) */}
      {activeTab === 'builder' && (
        <div className="no-print border-b border-[#E5E0D5] bg-[#FAF8F4]">
          <div className="max-w-[1480px] mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleNewBill}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#DDD7CB] bg-white px-3 py-1.5 text-xs font-medium text-[#181613] hover:bg-[#F3EFE6] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <FilePlus2 className="w-3.5 h-3.5 text-[#7D6635]" />
                <span>{t.newBill}</span>
              </button>
              <button
                type="button"
                onClick={handleSaveBill}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#DDD7CB] bg-white px-3 py-1.5 text-xs font-medium text-[#181613] hover:bg-[#F3EFE6] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookmarkCheck className="w-3.5 h-3.5 text-[#7D6635]" />
                <span>{t.saveBill}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#DDD7CB] bg-white px-3 py-1.5 text-xs font-medium text-[#181613] hover:bg-[#F3EFE6] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-[#7D6635]" />
                <span>{t.printBill}</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Language Switcher */}
              <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#EAE5DA]">
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    lang === 'en' ? 'bg-white text-[#181613] shadow-xs' : 'text-[#5A5347]'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLang('bn')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    lang === 'bn' ? 'bg-white text-[#181613] shadow-xs' : 'text-[#5A5347]'
                  }`}
                >
                  বাংলা
                </button>
              </div>

              {/* Preview Zoom Controls */}
              <div className="hidden md:flex items-center gap-1 p-0.5 rounded-md bg-[#EAE5DA]">
                {(
                  [
                    { id: 'fit', label: t.zoomFit },
                    { id: 0.75, label: '75%' },
                    { id: 1, label: '100%' },
                  ] as const
                ).map((z) => (
                  <button
                    key={String(z.id)}
                    type="button"
                    onClick={() => setZoomMode(z.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                      zoomMode === z.id ? 'bg-white text-[#181613] shadow-xs' : 'text-[#5A5347]'
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1">
        {activeTab === 'builder' && (
          <div className="max-w-[1480px] mx-auto grid grid-cols-1 lg:grid-cols-[480px_1fr] xl:grid-cols-[520px_1fr] min-h-[calc(100vh-105px)]">
            {/* Left Studio Editor */}
            <div className="no-print bg-[#FAF8F4] border-r border-[#E4DFD4] px-4 sm:px-6 py-6 overflow-y-auto">
              <InvoiceForm invoice={invoice} onChange={setInvoice} t={t} />
            </div>

            {/* Right Live A4 Preview Stage */}
            <div
              ref={previewStageRef}
              className="bg-[#E9E4DA] px-4 py-6 sm:py-8 flex flex-col items-center overflow-x-auto"
            >
              <div className="no-print w-full max-w-[794px] flex items-center justify-between text-xs text-[#6B6356] mb-3 px-1">
                <span>{t.previewLabel}</span>
                <span className="font-mono-num">A4 · 210 × 297 mm</span>
              </div>

              <div
                style={{
                  width: `${794 * activeScale}px`,
                  height: `${1123 * activeScale}px`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    transform: `scale(${activeScale})`,
                    transformOrigin: 'top left',
                    width: '794px',
                    boxShadow: '0 20px 50px -15px rgba(20, 18, 16, 0.35)',
                  }}
                >
                  <InvoicePreview
                    invoice={invoice}
                    settings={settings}
                    previewRef={invoiceSheetRef}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <SavedBillsView
            savedInvoices={savedInvoices}
            onLoadInvoice={handleLoadSaved}
            onDuplicateInvoice={handleDuplicateSaved}
            onDeleteInvoice={handleDeleteSaved}
            onDownloadSavedPdf={handleDownloadSavedPdf}
            onCreateNew={handleNewBill}
            t={t}
          />
        )}

        {activeTab === 'settings' && (
          <StoreSettingsView
            settings={settings}
            onSaveSettings={(next) => setSettings(next)}
            t={t}
          />
        )}
      </main>

      {/* Offscreen hidden render container for Saved Bills direct PDF export */}
      {pdfRenderTarget && (
        <div
          aria-hidden="true"
          style={{ position: 'fixed', left: '-12000px', top: 0, width: '794px', pointerEvents: 'none' }}
        >
          <InvoicePreview
            invoice={pdfRenderTarget}
            settings={settings}
            previewRef={hiddenExportRef}
          />
        </div>
      )}

      {/* Subtle Toast Notification */}
      {toastMsg && (
        <div className="no-print fixed bottom-5 right-5 z-50 rounded-md bg-[#181613] text-[#F5EFE4] px-4 py-2.5 text-xs font-medium shadow-lg border border-[#6E582B]">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
