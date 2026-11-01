'use client';

import React, { useState } from 'react';
import { ReservationItem, POSTable } from '@/types/posTableMap';
import { Calendar, Phone, Check, X, AlertCircle } from 'lucide-react';

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
    <div className="w-full xl:w-[380px] bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm mt-4 font-sans">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs uppercase font-bold text-stone-500 tracking-wider flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>Today's Reservations</span>
        </h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 tabular-nums">
          {reservations.length}
        </span>
      </div>

      {reservations.length === 0 ? (
        <div className="p-6 rounded-xl bg-stone-50 border border-stone-100 text-xs text-stone-400 text-center">
          No upcoming reservations for today
        </div>
      ) : (
        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
          {reservations.map((res) => {
            const isUnassigned = res.tableId === 'Unassigned' || !res.tableId;

            return (
              <div
                key={res.id}
                className={`p-3 rounded-xl border transition-all ${
                  res.status === 'LATE'
                    ? 'bg-red-50/60 border-red-200'
                    : 'bg-stone-50/80 border-stone-200/80'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-xs text-stone-900">
                    {res.time} • {res.customerName}
                  </span>
                  <span
                    className={`text-[11px] font-semibold tabular-nums ${
                      res.status === 'LATE' ? 'text-red-700' : 'text-stone-500'
                    }`}
                  >
                    {res.status === 'LATE'
                      ? `${res.lateMinutes}m late`
                      : res.remainingMinutes !== undefined
                      ? `in ${res.remainingMinutes}m`
                      : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1 text-[11px] text-stone-500">
                  <span className="tabular-nums">
                    {res.guestCount} guests • Table: {res.tableId}
                  </span>
                  {isUnassigned && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      Needs Table
                    </span>
                  )}
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-3 gap-2 mt-2.5">
                  <button
                    onClick={() => onCheckIn(res)}
                    className="py-1 text-xs font-semibold rounded-lg bg-white border border-stone-200 text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Check-in</span>
                  </button>
                  {isUnassigned ? (
                    <button
                      onClick={() => setAssigningRes(res)}
                      className="py-1 text-xs font-semibold rounded-lg bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100 transition-colors cursor-pointer"
                    >
                      Assign
                    </button>
                  ) : (
                    <button
                      onClick={() => onCallCustomer(res)}
                      className="py-1 text-xs font-semibold rounded-lg bg-white border border-stone-200 text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                    >
                      <Phone className="w-3 h-3 text-stone-500" />
                      <span>Call</span>
                    </button>
                  )}
                  <button
                    onClick={() => onCancel(res)}
                    className="py-1 text-xs font-medium rounded-lg bg-white border border-stone-200 text-stone-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                  >
                    <X className="w-3 h-3" />
                    <span>Cancel</span>
                  </button>
                </div>

                {/* Table assignment selector dropdown */}
                {assigningRes?.id === res.id && onAssignTable && (
                  <div className="mt-2 pt-2 border-t border-stone-200/80">
                    <p className="text-[11px] font-semibold text-stone-600 mb-1">
                      Choose an available table:
                    </p>
                    <div className="flex gap-1.5 flex-wrap">
                      {availableTables
                        .filter((t) => t.status === 'EMPTY')
                        .map((tbl) => {
                          const numId = Number(tbl.id.replace(/\D/g, '')) || 0;
                          return (
                            <button
                              key={tbl.id}
                              onClick={() => {
                                const resNumId = Number(res.id.replace(/\D/g, '')) || Number(res.id) || 0;
                                onAssignTable(resNumId, numId);
                                setAssigningRes(null);
                              }}
                              className="px-2 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md font-semibold cursor-pointer"
                            >
                              {tbl.name}
                            </button>
                          );
                        })}
                      <button
                        onClick={() => setAssigningRes(null)}
                        className="px-2 py-1 text-xs bg-stone-100 text-stone-500 rounded-md hover:bg-stone-200 cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
