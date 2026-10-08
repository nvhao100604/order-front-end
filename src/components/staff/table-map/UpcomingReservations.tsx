'use client';

import React from 'react';
import { ReservationItem } from '@/types/posTableMap';

interface UpcomingReservationsProps {
  reservations: ReservationItem[];
  onCheckIn: (res: ReservationItem) => void;
  onCallCustomer: (res: ReservationItem) => void;
  onCancel: (res: ReservationItem) => void;
}

export const UpcomingReservations: React.FC<UpcomingReservationsProps> = ({
  reservations,
  onCheckIn,
  onCallCustomer,
  onCancel,
}) => {
  return (
    <div className="w-[416px] space-y-2 mt-4">
      <h3 className="text-xs uppercase font-medium text-[#5F6575] tracking-wider">
        Upcoming · Next 60 Minutes
      </h3>

      {reservations.map((res) => (
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
              {res.status === 'LATE' ? `${res.lateMinutes}m late` : `in ${res.remainingMinutes}m`}
            </span>
          </div>

          <p className="text-xs text-[#5F6575] mt-0.5">
            {res.guestCount} guests · Table {res.tableId}
          </p>

          {res.status === 'LATE' && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              <button
                onClick={() => onCheckIn(res)}
                className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-white cursor-pointer"
              >
                Check-in
              </button>
              <button
                onClick={() => onCallCustomer(res)}
                className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#1F2535] hover:bg-white cursor-pointer"
              >
                Call Customer
              </button>
              <button
                onClick={() => onCancel(res)}
                className="py-1.5 text-xs font-semibold rounded-xl bg-[#FFFDF7] border border-[#CFC3A6] text-[#962B1A] hover:bg-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
