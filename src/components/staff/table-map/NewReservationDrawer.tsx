'use client';

import React, { useState, useEffect } from 'react';
import { DrawerGuestStepper } from './drawer/DrawerGuestStepper';
import { DrawerHoldWindowBanner } from './drawer/DrawerHoldWindowBanner';
import { DrawerCustomerForm } from './drawer/DrawerCustomerForm';
import { DrawerTableOptionsList, TableOption } from './drawer/DrawerTableOptionsList';
import { DrawerFooterActions } from './drawer/DrawerFooterActions';
import { tables_services } from '@/services/table.services';

interface NewReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    guests: number;
    name: string;
    phone: string;
    email?: string;
    note: string;
    date: string;
    time: string;
    selectedTableOption: string;
  }) => Promise<boolean | void> | boolean | void;
}

export const NewReservationDrawer: React.FC<NewReservationDrawerProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [guests, setGuests] = useState(4);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('19:30');
  const [selectedTableOption, setSelectedTableOption] = useState<string>('');
  const [tableOptions, setTableOptions] = useState<TableOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch recommended tables whenever party size changes
  useEffect(() => {
    let active = true;
    const fetchRecommendations = async () => {
      try {
        const res = await tables_services.recommendTables(guests);
        if (active && res.data && res.data.length > 0) {
          const mapped: TableOption[] = res.data.map((t, idx) => ({
            id: `B${t.id}`,
            title: `B${t.number || t.id} · ${t.maxCapacity} seats`,
            detail: idx === 0 ? 'Fits well · Recommended' : `Available · Fits up to ${t.maxCapacity}`,
            recommended: idx === 0,
            tag: idx === 0 ? 'Recommended' : undefined,
          }));
          setTableOptions(mapped);
          setSelectedTableOption(mapped[0]?.id || '');
        } else if (active) {
          setTableOptions([]);
          setSelectedTableOption('');
        }
      } catch {
        if (active) {
          setTableOptions([]);
        }
      }
    };

    if (isOpen) {
      fetchRecommendations();
    }
    return () => {
      active = false;
    };
  }, [guests, isOpen]);

  const handleConfirm = async () => {
    if (!name.trim() || !phone.trim()) {
      alert('Vui lòng nhập tên và số điện thoại.');
      return;
    }
    setIsSubmitting(true);
    try {
      const success = await onSubmit({
        guests,
        name,
        phone,
        email,
        note,
        date,
        time,
        selectedTableOption,
      });
      if (success !== false) {
        onClose();
        setName('');
        setPhone('');
        setEmail('');
        setNote('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
            email={email}
            onEmailChange={setEmail}
            note={note}
            onNoteChange={setNote}
          />

          <hr className="border-[#CFC3A6]/30 my-2" />

          {/* Smart Table Options */}
          <DrawerTableOptionsList
            options={tableOptions}
            selectedId={selectedTableOption}
            onSelect={setSelectedTableOption}
          />
        </div>

        {/* Footer Actions & Policy */}
        <DrawerFooterActions
          onCancel={onClose}
          onConfirm={handleConfirm}
        />
      </div>
    </div>
  );
};
