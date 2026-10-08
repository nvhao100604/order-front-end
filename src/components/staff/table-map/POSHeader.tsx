'use client';

import React from 'react';

interface POSHeaderProps {
  activeTab: 'map' | 'reservation' | 'order';
  onTabChange: (tab: 'map' | 'reservation' | 'order') => void;
  onNewReservationClick: () => void;
  onQueueClick: () => void;
  onReceiveCustomerClick: () => void;
  reservationCount?: number;
  userName?: string;
}

export const POSHeader: React.FC<POSHeaderProps> = ({
  activeTab,
  onTabChange,
  onNewReservationClick,
  onQueueClick,
  onReceiveCustomerClick,
  reservationCount = 2,
  userName = 'N',
}) => {
  return (
    <header className="w-full h-16 bg-[#1F2535] text-[#FBF5E4] px-6 flex items-center justify-between shadow-md">
      {/* Brand & Main Navigation Tabs */}
      <div className="flex items-center gap-6">
        <div className="flex items-baseline gap-2">
          <span className="font-serif text-2xl font-bold tracking-tight text-[#FBF5E4]">Foodie</span>
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#AEB3C2]">Staff POS</span>
        </div>

        <nav className="flex items-center gap-1">
          <button
            onClick={() => onTabChange('map')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'map' ? 'bg-[#3A4258] text-[#FBF5E4]' : 'text-[#AEB3C2] hover:text-white'
            }`}
          >
            Table Map
          </button>
          <button
            onClick={() => onTabChange('reservation')}
            className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reservation' ? 'bg-[#3A4258] text-[#FBF5E4]' : 'text-[#AEB3C2] hover:text-white'
            }`}
          >
            <span>Reservations</span>
            {reservationCount > 0 && (
              <span className="bg-[#F8DCD5] text-[#962B1A] text-xs font-bold px-2 py-0.5 rounded-full">
                {reservationCount}
              </span>
            )}
          </button>
          <button
            onClick={() => onTabChange('order')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
              activeTab === 'order' ? 'bg-[#3A4258] text-[#FBF5E4]' : 'text-[#AEB3C2] hover:text-white'
            }`}
          >
            Take Order
          </button>
        </nav>
      </div>

      {/* Quick Action Buttons & User Profile Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onReceiveCustomerClick}
          className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#3A4258] hover:bg-[#3A4258] transition-all text-[#FBF5E4] cursor-pointer"
        >
          Walk-in
        </button>
        <button
          onClick={onQueueClick}
          className="px-4 py-2 text-sm font-semibold rounded-xl border border-[#3A4258] hover:bg-[#3A4258] transition-all text-[#FBF5E4] cursor-pointer"
        >
          Waitlist · 2
        </button>
        <button
          onClick={onNewReservationClick}
          className="px-4 py-2 text-sm font-semibold rounded-xl bg-[#F25C14] hover:bg-[#d84e0e] transition-all text-[#FFF9F0] shadow-sm cursor-pointer"
        >
          + New Reservation
        </button>
        <div className="w-9 h-9 rounded-full bg-[#F3EAD3] text-[#1F2535] font-bold flex items-center justify-center text-sm shadow-inner ml-1 select-none">
          {userName[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};
