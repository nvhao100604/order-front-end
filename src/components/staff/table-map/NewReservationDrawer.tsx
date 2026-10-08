'use client';

import React, { useState } from 'react';
import { DrawerGuestStepper } from './drawer/DrawerGuestStepper';
import { DrawerHoldWindowBanner } from './drawer/DrawerHoldWindowBanner';
import { DrawerCustomerForm } from './drawer/DrawerCustomerForm';
import { DrawerTableOptionsList, TableOption } from './drawer/DrawerTableOptionsList';
import { DrawerFooterActions } from './drawer/DrawerFooterActions';

interface NewReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    guests: number;
    name: string;
    phone: string;
    note: string;
    selectedTableOption: string;
  }) => void;
}

const DEFAULT_TABLE_OPTIONS: TableOption[] = [
  {
    id: 'B7',
    title: 'B7 · 6 seats',
    detail: 'Fits well · expected available 20:15',
    recommended: true,
    tag: 'Recommended',
  },
  {
    id: 'B4+B5',
    title: 'B4 + B5 · 8 seats',
    detail: 'Adjacent merge · same cluster · expected available 20:00',
    recommended: false,
  },
  {
    id: 'B12',
    title: 'B12 · 8 seats',
    detail: 'Reserved 19:30 · overlapping time slot · still selectable',
    recommended: false,
    isWarning: true,
  },
];

export const NewReservationDrawer: React.FC<NewReservationDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [guests, setGuests] = useState(6);
  const [name, setName] = useState('Mr. Nam');
  const [phone, setPhone] = useState('0901 234 567');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('20:30');
  const [selectedTableOption, setSelectedTableOption] = useState('B7');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Scrim Backdrop */}
      <div className="fixed inset-0 bg-[#1F2535]/45 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-[440px] h-full bg-[#FFFDF7] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 font-sans">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-center pb-3 border-b border-[#CFC3A6]/30">
            <h2 className="font-serif text-2xl font-bold text-[#1F2535]">New Reservation</h2>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F3EAD3] text-[#1F2535] flex items-center justify-center font-bold hover:bg-[#CFC3A6] cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Guest & Date/Time Stepper */}
          <DrawerGuestStepper
            guests={guests}
            onGuestsChange={setGuests}
            date={date}
            onDateChange={setDate}
            time={time}
            onTimeChange={setTime}
          />

          {/* Hold Window Notification */}
          <DrawerHoldWindowBanner />

          {/* Customer Info Form */}
          <DrawerCustomerForm
            name={name}
            onNameChange={setName}
            phone={phone}
            onPhoneChange={setPhone}
            note={note}
            onNoteChange={setNote}
          />

          <hr className="border-[#CFC3A6]/30 my-2" />

          {/* Smart Table Options */}
          <DrawerTableOptionsList
            options={DEFAULT_TABLE_OPTIONS}
            selectedId={selectedTableOption}
            onSelect={setSelectedTableOption}
          />
        </div>

        {/* Footer Actions & Policy */}
        <DrawerFooterActions
          onCancel={onClose}
          onConfirm={() =>
            onSubmit({ guests, name, phone, note, selectedTableOption })
          }
        />
      </div>
    </div>
  );
};
