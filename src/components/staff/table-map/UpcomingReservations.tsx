'use client';

import React, { useState } from 'react';
import { ReservationItem, POSTable } from '@/types/posTableMap';

interface UpcomingReservationsProps {
  reservations: ReservationItem[];
  availableTables?: POSTable[];
  onCheckIn: (res: ReservationItem) => void;
  onCallCustomer: (res: ReservationItem) => void;
  onCancel: (res: ReservationItem) => void;
  onAssignTable?: (reservationId: number, tableId: number) => void;
}

export const UpcomingReservations: React.FC<UpcomingReservationsProps> = ({
  reservations,
  availableTables = [],
  onCheckIn,
  onCallCustomer,
  onCancel,
  onAssignTable,
}) => {
  const [assigningRes, setAssigningRes] = useState<ReservationItem | null>(null);

  return (
    <div className="w-[416px] space-y-2 mt-4 font-sans">
      <h3 className="text-xs uppercase font-medium text-[#5F6575] tracking-wider">
        Upcoming · Today's Reservations ({reservations.length})
      </h3>

      {reservations.length === 0 ? (
        <div className="p-4 rounded-2xl bg-[#FFFDF7] border border-[#CFC3A6]/40 text-xs text-[#5F6575] text-center">
          No upcoming reservations for today
        </div>
      ) : (
        reservations.map((res) => {
          const isUnassigned = res.tableId === 'Unassigned' || !res.tableId;

          return (
            <div
              key={res.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                res.status === 'LATE'
                  ? 'bg-[#F8DCD5]/60 border-[#D4806F]'
                  : 'bg-[#F3EAD3] border-[#CFC3A6]/60'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm text-[#1F2535]">
                  {res.time} · {res.customerName}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    res.status === 'LATE' ? 'text-[#962B1A]' : 'text-[#5F6575]'
                  }`}
                >
                  {res.status === 'LATE'
                    ? `${res.lateMinutes}m late`
                    : res.remainingMinutes !== undefined
                    ? `in ${res.remainingMinutes}m`
                    : ''}
                </span>
              </div>

              <div className="flex items-center justify-between mt-0.5">
                <p className="text-xs text-[#5F6575]">
                  {res.guestCount} guests · Table: {res.tableId}
                </p>
                {isUnassigned && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F8E7BE] text-[#7A4E06] border border-[#D9A63E]/60">
                    Needs Table
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <button
                  onClick={() => onCheckIn(res)}
                  className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-white cursor-pointer"
                >
                  Check-in
                </button>
                {isUnassigned ? (
                  <button
                    onClick={() => setAssigningRes(res)}
                    className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#2F6140] hover:bg-white cursor-pointer font-bold"
                  >
                    Assign Table
                  </button>
                ) : (
                  <button
                    onClick={() => onCallCustomer(res)}
                    className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-white cursor-pointer"
                  >
                    Call
                  </button>
                )}
                <button
                  onClick={() => {
                    if (confirm(`Cancel reservation for ${res.customerName}?`)) {
                      onCancel(res);
                    }
                  }}
                  className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#962B1A] hover:bg-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          );
        })
      )}

      {/* Quick Table Assignment Modal */}
      {assigningRes && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2535]/30 backdrop-blur-xs">
          <div className="bg-[#FFFDF7] rounded-2xl p-5 w-80 border border-[#CFC3A6]/40 shadow-xl space-y-3">
            <h4 className="font-serif text-lg font-bold text-[#1F2535]">
              Assign Table for {assigningRes.customerName}
            </h4>
            <p className="text-xs text-[#5F6575]">
              Party size: {assigningRes.guestCount} guests
            </p>
            <div className="max-h-48 overflow-y-auto space-y-1.5">
              {availableTables.filter((t) => t.status === 'EMPTY').map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    const numericResId = Number(assigningRes.id.replace(/\D/g, ''));
                    const numericTableId = Number(t.id.replace(/\D/g, ''));
                    onAssignTable?.(numericResId, numericTableId);
                    setAssigningRes(null);
                  }}
                  className="w-full text-left p-2.5 rounded-xl border border-[#CFC3A6]/60 hover:bg-[#F3EAD3] text-xs font-semibold text-[#1F2535] flex justify-between cursor-pointer"
                >
                  <span>{t.name}</span>
                  <span className="text-[#5F6575]">{t.capacity} seats</span>
                </button>
              ))}
              {availableTables.filter((t) => t.status === 'EMPTY').length === 0 && (
                <p className="text-xs text-[#962B1A] py-2 text-center">No available empty tables</p>
              )}
            </div>
            <button
              onClick={() => setAssigningRes(null)}
              className="w-full py-2 bg-[#F3EAD3] text-xs font-semibold rounded-xl text-[#1F2535] cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
