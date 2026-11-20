import React, { useRef, useState } from 'react';
import {
  ArrowLeft,
  Download,
  FileText,
  Receipt,
  Search,
  Truck,
} from 'lucide-react';
import { BusinessSettings, Invoice } from '../types/business';
import { api } from '../utils/api';
import { exportInvoiceElementToPdf, formatCurrency } from '../utils/calculations';
import { ScaledInvoicePreview } from './ScaledInvoicePreview';

interface ViewPanelViewProps {
  onBack: () => void;
}

interface BillMatch {
  invoice: Invoice;
  settings: BusinessSettings;
}

export const ViewPanelView: React.FC<ViewPanelViewProps> = ({ onBack }) => {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<BillMatch[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<BillMatch | null>(null);
  const [exportingPdf, setExportingPdf] = useState(false);

  const sheetRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSearchError(
        'Please enter at least 2 characters (Order / Invoice No or Client Name).'
      );
      return;
    }

    setSearching(true);
    setSearchError('');
    setSelectedMatch(null);
    try {
      const data = await api.searchPublicBills(trimmed);
      setResults(data.results);
      setHasSearched(true);
      if (data.results.length === 1) {
        setSelectedMatch(data.results[0]);
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Failed to search bills.');
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!sheetRef.current || !selectedMatch) return;
    setExportingPdf(true);
    try {
      const safeName = (selectedMatch.invoice.customerName || 'Customer').replace(
        /[^a-zA-Z0-9_-]+/g,
        '_'
      );
      await exportInvoiceElementToPdf(
        sheetRef.current,
        `${selectedMatch.invoice.invoiceNumber}_${safeName}.pdf`
      );
    } finally {
      setExportingPdf(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-10">
      <div className="no-print flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6D9EE] bg-white px-3.5 py-2 text-xs font-semibold text-[#4A3B59] hover:border-[#9333EA] hover:text-[#7E22CE] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        <span className="text-xs font-semibold text-[#7E22CE]">
          View Panel · Order &amp; Bill Search
        </span>
      </div>

      {/* Search Box Card */}
      <div className="no-print max-w-3xl mx-auto rounded-3xl border border-[#EFE2F5] bg-white p-6 sm:p-8 shadow-xs space-y-5">
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FDF2F8] to-[#F3E8FF] border border-[#FBCFE8] text-[#DB2777] mb-1">
            <Receipt className="w-6 h-6" />
          </div>
          <h1 className="font-display-serif text-2xl sm:text-3xl font-bold text-[#1F122B]">
            View Client Bill &amp; Order
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5B7B] max-w-xl mx-auto">
            Enter an <strong>Order / Invoice Number</strong> (e.g.{' '}
            <span className="font-mono-num">GG-001</span>) or{' '}
            <strong>Client Name</strong> to search and view the full invoice.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9333EA] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Order No (GG-001) or Client Name..."
              className="w-full rounded-xl border border-[#E6D9EE] bg-[#FDFBFE] pl-10 pr-4 py-3 text-sm text-[#1F122B] placeholder:text-[#A493B5] focus:border-[#9333EA] focus:bg-white focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#DB2777] to-[#7E22CE] px-6 py-3 text-sm font-semibold text-white hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            <span>{searching ? 'Searching...' : 'Search Bill'}</span>
          </button>
        </form>

        {searchError && (
          <div className="rounded-xl border border-[#FECDD3] bg-[#FFF1F2] px-4 py-2.5 text-xs font-medium text-[#BE123C]">
            {searchError}
          </div>
        )}
      </div>

      {/* Search Results List */}
      {hasSearched && !selectedMatch && (
        <div className="max-w-4xl mx-auto">
          {results.length === 0 ? (
            <div className="rounded-2xl border border-[#EFE2F5] bg-white p-10 text-center space-y-2">
              <FileText className="w-8 h-8 text-[#C4B5D9] mx-auto" />
              <div className="text-sm font-bold text-[#1F122B]">
                No matching bill found for &ldquo;{query.trim()}&rdquo;
              </div>
              <p className="text-xs text-[#6B5B7B]">
                Please check the Order / Invoice Number or Client Name and try again.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-[#5B4B6B] px-1">
                Found {results.length} matching{' '}
                {results.length === 1 ? 'bill' : 'bills'} — click any bill to view full invoice
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.map((match) => {
                  const inv = match.invoice;
                  const sym = match.settings.currencySymbol || '₹';
                  return (
                    <div
                      key={inv.id}
                      className="rounded-2xl border border-[#EFE2F5] bg-white p-4 flex items-center justify-between gap-4 hover:border-[#9333EA] transition-colors"
                    >
                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono-num text-sm font-bold text-[#6D28D9]">
                            {inv.invoiceNumber}
                          </span>
                          <span className="text-[11px] font-mono-num text-[#6B5B7B]">
                            {inv.invoiceDate}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-[#F5F3FF] px-2 py-0.5 text-[10px] font-semibold text-[#7E22CE]">
                            <Truck className="w-3 h-3" />
                            {inv.deliveryStatus}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-[#1F122B] truncate">
                          {inv.customerName}
                        </div>
                        <div className="text-xs text-[#6B5B7B] truncate">
                          {inv.items.length}{' '}
                          {inv.items.length === 1 ? 'item' : 'items'}
                          {inv.customerCityStatePin
                            ? ` · ${inv.customerCityStatePin}`
                            : ''}
                        </div>
                        <div className="text-xs font-mono-num font-bold text-[#1F122B]">
                          Total: {formatCurrency(inv.totalAmount, sym)}
                          {inv.dueAmount > 0 && (
                            <span className="ml-2 text-[#BE123C]">
                              (Due: {formatCurrency(inv.dueAmount, sym)})
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedMatch(match)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#DB2777] to-[#7E22CE] px-4 py-2 text-xs font-semibold text-white hover:opacity-95 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Bill</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Mobile-Responsive Black & Gold Invoice View */}
      {selectedMatch && (
        <div className="space-y-4">
          <div className="no-print max-w-[794px] mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {results.length > 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedMatch(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#E6D9EE] bg-white px-3.5 py-2 text-xs font-semibold text-[#4A3B59] hover:border-[#9333EA] whitespace-nowrap cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Results ({results.length})</span>
                </button>
              )}
              <span className="text-xs font-semibold text-[#5B4B6B]">
                Invoice{' '}
                <strong className="font-mono-num text-[#6D28D9]">
                  {selectedMatch.invoice.invoiceNumber}
                </strong>{' '}
                · {selectedMatch.invoice.customerName}
              </span>
            </div>

            <button
              type="button"
              disabled={exportingPdf}
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#DB2777] to-[#7E22CE] px-4 py-2 text-xs font-semibold text-white hover:opacity-95 whitespace-nowrap cursor-pointer disabled:opacity-60"
            >
              <Download className="w-4 h-4" />
              <span>{exportingPdf ? 'Creating PDF...' : 'Download PDF Bill'}</span>
            </button>
          </div>

          <div className="pb-6 max-w-[794px] mx-auto">
            <ScaledInvoicePreview
              invoice={selectedMatch.invoice}
              settings={selectedMatch.settings}
              sheetRef={sheetRef}
            />
          </div>
        </div>
      )}
    </div>
  );
};
