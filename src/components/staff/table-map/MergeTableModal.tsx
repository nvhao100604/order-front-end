'use client';

import React, { useState, useMemo } from 'react';
import { POSTable } from '@/types/posTableMap';
import { tables_services } from '@/services/table.services';
import { toast } from 'react-toastify';
import { X, Check, GitMerge, Loader2 } from 'lucide-react';

interface MergeTableModalProps {
  isOpen: boolean;
  currentTable: POSTable | null;
  allTables: POSTable[];
  onClose: () => void;
  onMergeSuccess?: () => void;
}

export const MergeTableModal: React.FC<MergeTableModalProps> = ({
  isOpen,
  currentTable,
  allTables,
  onClose,
  onMergeSuccess,
}) => {
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter eligible tables: other tables in EMPTY or OCCUPIED status
  const eligibleTables = useMemo(() => {
    if (!currentTable) return [];
    return allTables.filter(
      (t) =>
        t.id !== currentTable.id &&
        (t.status === 'EMPTY' || t.status === 'OCCUPIED')
    );
  }, [allTables, currentTable]);

  if (!isOpen || !currentTable) return null;

  const handleToggleSelect = (tableId: string) => {
    setSelectedTargetIds((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId]
    );
  };

  const handleConfirmMerge = async () => {
    if (selectedTargetIds.length === 0) {
      toast.warn('Please select at least one table to merge.');
      return;
    }

    const currentNumericId = Number(currentTable.id.replace(/\D/g, ''));
    const targetNumericIds = selectedTargetIds.map((id) =>
      Number(id.replace(/\D/g, ''))
    );
    const tableIDs = [currentNumericId, ...targetNumericIds].filter(
      (num) => Number.isFinite(num) && num > 0
    );

    if (tableIDs.length < 2) {
      toast.error('Invalid table ID for merging.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await tables_services.mergeTables(tableIDs);
      if (res?.data || res?.success) {
        toast.success(
          `Merged table ${currentTable.name} with ${selectedTargetIds.join(', ')} successfully!`
        );
        setSelectedTargetIds([]);
        onMergeSuccess?.();
        onClose();
      } else {
        toast.error(res?.message || 'Failed to merge tables.');
      }
    } catch (err: any) {
      console.error('Merge tables error:', err);
      toast.error(
        err.response?.data?.detail || err.message || 'Error submitting table merge request.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#FFFDF7] rounded-3xl p-6 shadow-2xl border border-[#CFC3A6]/40 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#CFC3A6]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F25C14]/10 text-[#F25C14] flex items-center justify-center">
              <GitMerge className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#1F2535]">
                Merge Tables
              </h2>
              <p className="text-xs text-[#5F6575]">
                Source Table:{' '}
                <strong className="text-[#1F2535]">{currentTable.name}</strong> ({currentTable.area})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 rounded-xl text-[#5F6575] hover:bg-[#F3EAD3]/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          <p className="text-xs font-medium text-[#5F6575]">
            Select one or more available tables to merge into a single shared order group:
          </p>

          {eligibleTables.length === 0 ? (
            <div className="py-8 text-center text-sm text-[#5F6575] bg-[#FBF5E4]/50 rounded-2xl border border-dashed border-[#CFC3A6]">
              No eligible tables available to merge in this area.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {eligibleTables.map((table) => {
                const isSelected = selectedTargetIds.includes(table.id);
                return (
                  <button
                    key={table.id}
                    type="button"
                    onClick={() => handleToggleSelect(table.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between relative cursor-pointer ${
                      isSelected
                        ? 'bg-[#F8E7BE] border-[#D9A63E] ring-2 ring-[#D9A63E]/40'
                        : 'bg-white border-[#CFC3A6]/40 hover:bg-[#F3EAD3]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base text-[#1F2535]">
                        {table.name}
                      </span>
                      <div
                        className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#F25C14] border-[#F25C14] text-white'
                            : 'border-[#CFC3A6] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-[#5F6575]">
                      <span>{table.capacity} seats</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          table.status === 'EMPTY'
                            ? 'bg-[#E1EDDD] text-[#2F6140]'
                            : 'bg-[#F8E7BE] text-[#7A4E06]'
                        }`}
                      >
                        {table.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-[#CFC3A6]/30 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl border border-[#CFC3A6] text-[#1F2535] hover:bg-[#F3EAD3]/40 text-sm font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmMerge}
            disabled={isSubmitting || selectedTargetIds.length === 0}
            className="px-5 py-2.5 rounded-xl bg-[#F25C14] hover:bg-[#d84e0e] text-white text-sm font-semibold transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <GitMerge className="w-4 h-4" />
                <span>Confirm Merge ({selectedTargetIds.length})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
