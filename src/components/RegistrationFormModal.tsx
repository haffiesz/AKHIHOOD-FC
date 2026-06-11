import React, { useState, useEffect } from 'react';
import { Player } from '../types';
import { X, Trophy, Sparkles, User, Phone } from 'lucide-react';

interface RegistrationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  slotNo: number | null;
  player: Player | null; // existing player in this slot if any
  onSave: (name: string, phone: string) => void;
  onDelete: () => void;
}

const TEMPLATE_PLAYERS = [
  'Wak Dollah', 'Cikgu Shamsul', 'Man Kedah', 'Hafiez Kilat', 'Lan Karat',
  'Abe Zul', 'Hafiz Tajuddin', 'Abang Long Mat', 'Lan Selayang', 'Pok De',
  'Roy Rawang', 'Rizal Meru', 'Ustaz Rosli', 'Zainal Abidin', 'Kamil Akhihood'
];

export default function RegistrationFormModal({
  isOpen,
  onClose,
  slotNo,
  player,
  onSave,
  onDelete,
}: RegistrationFormModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Settle inputs depending on player state
  useEffect(() => {
    if (player) {
      setName(player.name);
      setPhone(player.phone || '');
    } else {
      setName('');
      setPhone('');
    }
  }, [player, slotNo, isOpen]);

  if (!isOpen || slotNo === null) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave(name.trim(), phone.trim());
    onClose();
  };

  const handleRandomize = () => {
    const randomName = TEMPLATE_PLAYERS[Math.floor(Math.random() * TEMPLATE_PLAYERS.length)];
    setName(randomName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-semibold text-white tracking-wide font-display">
              {player ? `Update Slot ${slotNo}` : `Secure Roster Slot ${slotNo}`}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl text-xs text-slate-400">
            Register this slot for the <span className="font-bold text-amber-400 font-mono">Akhihood FC</span> friendly match.
          </div>

          {/* Input field name */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-350 flex items-center gap-1.5 select-none">
                <User className="w-3.5 h-3.5 text-amber-500" />
                Player Name
              </label>
              {!player && (
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 px-2 py-0.5 rounded-lg transition cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Auto-Fill Name
                </button>
              )}
            </div>
            <input
              type="text"
              required
              placeholder="Enter full name / nickname..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition font-medium"
            />
          </div>

          {/* Phone field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-350 flex items-center gap-1.5 select-none font-display">
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              Phone Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="e.g., +60123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition font-mono"
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-sm py-2.5 px-4 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              {player ? 'Save Changes' : 'Register Now'}
            </button>

            {player && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Clear slot ${slotNo}?`)) {
                    onDelete();
                    onClose();
                  }
                }}
                className="w-full bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-rose-400 font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
              >
                Remove Player from Slot
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-slate-800/60 hover:bg-slate-800 text-slate-400 font-bold text-xs py-2 px-4 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
